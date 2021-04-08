const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();
/**
 * создаем ассинхронную функцию регистрации 
 * получаем ошибки если они есть
 * проверяем пустой или нет массив из ошибок, если нет возвращаем ошибку
 * берем данные с сервера
 * проверяем на логин и майл, если они есть возвращаем ошибку
 * кэшируем пароль
 * создаем нового юзера
 * сохраняем его
 * отправлеям сообщение об успешной регистрации
 * создаем ассинхронную фунцию получения юзеров
 * находим всех юзеров которые есть
 * отправляем их в запросе
 * если есть ошибки в первой или второй функции возвращаем их  в катче
 */

class usersController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Ошибка при регистрации', errors });
      }

      const { username, password, name, surname, mail } = req.body;

      const condidate = await User.findOne({ username });

      if (condidate) {
        return res
          .status(400)
          .json({ mesagge: 'Пользователь с таким именем существует' });
      }

      const condidateMail = await User.findOne({ mail });

      if (condidateMail) {
        return res
          .status(400)
          .json({ mesagge: `Пользователь с таким ${user.mail} существует` });
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const user = new User({
        username,
        password: hashPassword,
        name,
        surname,
        mail,
        role: 'USER',
      });
      await user.save();
      return res.json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async getUsers(req, res) {

    try {
      const users = await User.find();

      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new usersController();
