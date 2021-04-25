module.exports = (req, res, next) => {
  try {
    //Проверка роли
    if (req.user.role !== 'USER') {
      return res.status(403).json({ message: 'У вас нет доступа' });
    }

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
