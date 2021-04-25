const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const bearer = req.headers.authorization.split(' ')[0];
    const token = req.headers.authorization.split(' ')[1];

    if (bearer !== 'Bearer') {
      return res
        .status(401)
        .json({
          message: 'Пользователь не авторизован(неправильный тип токена)',
        });
    }

    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }

    req.user = jwt.verify(token, process.env.MY_SECRET_KEY);

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
