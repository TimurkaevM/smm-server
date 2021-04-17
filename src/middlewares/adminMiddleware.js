const jwt = require('jsonwebtoken');
require('dotenv').config();

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

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'У вас нет доступа' });
    }

    next();
  } catch (e) {
    return res.status(403).json({ message: 'Пользователь не авторизован' });
  }
};
