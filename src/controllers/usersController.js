const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const mailer = require('../nodemailer/nodemailer');

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

      const newUser = new User({
        username,
        password: hashPassword,
        name,
        surname,
        mail,
        role: 'USER',
      });
      await newUser.save();

      const message = {
        to: newUser.mail,
        subject: 'Congratulations! You are successfuly registred on oyr site.',
        html: `
          <h2>Поздравляем вы были добавлены в smm-блокнот Миланы Асиевой!</h2>

          <i>Данные вашей учетной записи:</i>

          <ul>
            <li>username: ${username},</li>
            <li>password: ${password}</li>
          </ul>

          <h4>Перейти в smm-блокнот можно по ссылке:</h4>
          <a href="#">Ссылка</a>
        `,
      };

      mailer(message);

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

  async getOneUser(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (e) {
      console.log(e);
    }
  }

  async updateUser(req, res) {
    try {
      const { username, password, name, surname, mail } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      await user.update({
        username,
        password: hashPassword,
        name,
        surname,
        mail,
      });
      return res.json({ message: 'Пользователен успешно изменен' });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteUser(req, res) {
    try {
      const delUser = await User.findById(req.params.id);

      if (!delUser) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      await delUser.remove();

      return res.json({ message: 'Пользователь удален' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Deleting error' });
    }
  }
}

module.exports = new usersController();
