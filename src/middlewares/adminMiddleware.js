const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'У вас нет доступа' });
    }

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
