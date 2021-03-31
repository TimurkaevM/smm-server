const jwt = require('jsonwebtoken');
const { secret } = require('../routes/Config');

module.exports = (roles) => {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'Пользователь не авторизован' });
      }

      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRoles) {
        return res.status(403).json({ message: 'У вас нет доступа!' });
      }

      next();
    } catch (e) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
  };
};
