const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * 
 * импорт жвт 
 * получение ключей procces.env из файла .env
 * экспортирую функцию которые принимает 3 парамметра (получаемый запрос, отправляемый запрос, продолжение )
 * получаем сам токен 
 * если токен не верный или его нет выводим ошибку
 * в юзер сохраняем полученные данные из токена
 * выполнение след действия

 */
module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }

    req.user = jwt.verify(token, process.env.MY_SECRET_KEY);

    next();
  } catch (e) {
    return res.status(403).json({ message: 'Пользователь не авторизован' });
  }
};
