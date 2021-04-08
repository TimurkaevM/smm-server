const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
require('dotenv').config();

/**
 * генерируем токен
 * создаем ассинхронную функцию login
 * получаем пароль и логин
 * ищем пользователя с похожим логином, если он есть то возвращаем ошибку
 * сравниваем закешиованый код и введеный, если не совпадает возвращаем ошибку
 * создаем токен
 * выводим токен и роль
 * делаем обработку ошибок еси они есть
 */

const generateAccesToken = (id, role) => {
  const payload = {
    id,
    role,
  };

  console.log(generateAccesToken);

  return jwt.sign(payload, process.env.MY_SECRET_KEY);
};

class authController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${username} не найден` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: `Неверный пароль` });
      }

      const token = generateAccesToken(user._id, user.role);

      return res.json({ token, role: user.role });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login error' });
    }
  }
}

module.exports = new authController();
