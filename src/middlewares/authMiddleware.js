const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //Проверка метода
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    //Получаем токен и его тип
    const [bearer, token] = req.headers.authorization.split(' ');

    //Проверка типа токена
    if (bearer !== 'Bearer') {
      return res.status(401).json({
        message: 'Пользователь не авторизован(неправильный тип токена)',
      });
    }

    //Проверка токена
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }

    //Получение данных из токена
    req.user = jwt.verify(token, process.env.MY_SECRET_KEY);

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
