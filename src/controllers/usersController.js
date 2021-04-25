const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const mailer = require('../nodemailer/nodemailer');

require('dotenv').config();

class usersController {
  //Функция регестрации пользователя
  async registration(req, res) {
    try {
      //Получения всех ошибок валидации, выводим если они есть
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(417)
          .json({ message: 'Ошибка при регистрации', errors });
      }

      //Получения данных о пользователе
      const { username, password, name, surname, mail } = req.body;

      //Поиск пользователя по его логину
      const condidate = await User.findOne({ username });

      //Проверка, если польователем с таким логином есть в БД выводим ошибку
      if (condidate) {
        return res
          .status(417)
          .json({ mesagge: 'Пользователь с таким именем существует' });
      }

      //Поиск пользователя по его майлу
      const condidateMail = await User.findOne({ mail });

      //Проверка, если польователем с таким майлом есть в БД выводим ошибку
      if (condidateMail) {
        return res
          .status(417)
          .json({ mesagge: `Пользователь с таким ${user.mail} существует` });
      }

      //Кэшируем пароль
      const hashPassword = bcrypt.hashSync(password, 7);

      //Создаем нового пользователя
      const newUser = new User({
        username,
        password: hashPassword,
        name,
        surname,
        mail,
        role: 'USER',
      });

      //Сохраняем пользователя в БД
      await newUser.save();

      //Создаем сообщение для отправки на майл пользователя
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

      //Отправка сообщения
      mailer(message);

      //Отправляем сообщение об успешном добавление пользователя
      return res
        .status(200)
        .json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  //Функция получения пользователей
  async getUsers(req, res) {
    try {
      //Поиск пользователя
      const users = await User.find().select('name surname mail');

      //Отправляем найденных пользователей
      res.status(200).json(users);
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: 'Users not found' });
    }
  }

  //Функция получения пользователя
  async getOneUser(req, res) {
    try {
      //находим пользователя по айди
      const user = await User.findById(req.params.id).select(
        'name surname mail',
      );

      //Проверка, если пользователя нету выводим ошибку
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      //Отправляем пользователя
      res.status(200).json(user);
    } catch (e) {
      console.log(e);
    }
  }

  //Функция изменения пользователя
  async updateUser(req, res) {
    try {
      //Получение пользователя
      const { username, password, name, surname, mail } = req.body;

      //Поиск пользователя по айди
      const user = await User.findById(req.params.id);

      //Проверка, если пользователя нету выводим ошибку
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      //Кэшируем пароль
      const hashPassword = bcrypt.hashSync(password, 7);

      await user.update({
        username: !username ? user.username : username,
        password: !password ? user.password : hashPassword,
        name: !name ? user.name : name,
        surname: !surname ? user.surname : surname,
        mail: !mail ? user.mail : mail,
      });

      //Создаем сообщение для отправки на майл пользователя
      const message = {
        to: user.mail,
        subject: 'Congratulations! You are successfuly registred on oyr site.',
        html: `
          <h2>Ваши данные были изменены!</h2>

          <i> Новые данные вашей учетной записи:</i>

          <ul>
            <li>username: ${username},</li>
            <li>password: ${password}</li>
          </ul>

          <h4>Перейти в smm-блокнот можно по ссылке:</h4>
          <a href="#">Ссылка</a>
        `,
      };

      //Отправка сообщения
      mailer(message);

      //Отправляем сообщение об успешном изменение пользователя
      return res.json({ message: 'Пользователен успешно изменен' });
    } catch (e) {
      console.log(e);
    }
  }

  //Функция удаления пользователя
  async deleteUser(req, res) {
    try {
      //Поиск пользователя по айди
      const user = await User.findById(req.params.id);

      //Проверка, если пользователя нету выводим ошибку
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      //Удаление пользователя
      await user.remove();

      //Отправляем сообщение об успешном удаление
      return res.json({ message: 'Пользователь удален' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Deleting error' });
    }
  }
}

module.exports = new usersController();
