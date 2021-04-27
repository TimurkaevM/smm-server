const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const mailer = require('../nodemailer/nodemailer');
const User = require('../models/User');

// Функция регистрации пользователя
async function registration(req, res) {
  try {
    // Получения всех ошибок валидации, выводим если они есть
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(417)
        .json({ message: 'Ошибка при регистрации', errors });
    }

    // Получения данных о пользователе
    const { username, password, name, surname, mail } = req.body;

    // Поиск пользователя по его логину
    const candidate = await User.findOne({ username });

    // Проверка, если пользователем с таким логином есть в БД выводим ошибку
    if (candidate) {
      return res
        .status(417)
        .json({ message: 'Пользователь с таким именем существует' });
    }

    // Поиск пользователя по его mail
    const candidateMail = await User.findOne({ mail });

    // Проверка, если пользователем с таким mail есть в БД выводим ошибку
    if (candidateMail) {
      return res
        .status(417)
        .json({ message: `Пользователь с таким ${user.mail} существует` });
    }

    // Шифруем пароль
    const hashPassword = bcrypt.hashSync(password, 7);

    // Создаем нового пользователя
    const newUser = new User({
      username,
      password: hashPassword,
      name,
      surname,
      mail,
      role: 'USER',
    });

    // Сохраняем пользователя в БД
    await newUser.save();

    // Создаем сообщение для отправки на mail пользователя
    const message = {
      to: newUser.mail,
      subject: 'Congratulations! You are successfully registered on oyr site.',
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

    // Отправка сообщения
    mailer(message);

    // Отправляем сообщение об успешном добавление пользователя
    res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Registration error' });
  }
}

// Функция получения пользователей
async function getUsers(req, res) {
  try {
    // Поиск пользователя
    const users = await User.find().select('name surname mail');

    // Отправляем найденных пользователей
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: 'Users not found' });
  }
}

// Функция получения пользователя
async function getOneUser(req, res) {
  try {
    // находим пользователя по айди
    const user = await User.findById(req.params.id).select('name surname mail');

    // Проверка, если пользователя нету выводим ошибку
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Отправляем пользователя
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
  }
}

// Функция изменения пользователя
async function updateUser(req, res) {
  try {
    // Получение пользователя
    const { username, password, name, surname, mail } = req.body;

    // Поиск пользователя по айди
    const user = await User.findById(req.params.id);

    // Проверка, если пользователя нету выводим ошибку
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Кэшируем пароль
    const hashPassword = bcrypt.hashSync(password, 7);

    await user.update({
      username: !username ? user.username : username,
      password: !password ? user.password : hashPassword,
      name: !name ? user.name : name,
      surname: !surname ? user.surname : surname,
      mail: !mail ? user.mail : mail,
    });

    // Создаем сообщение для отправки на mail пользователя
    const message = {
      to: user.mail,
      subject: 'Congratulations! You are successfully registered on oyr site.',
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

    // Отправка сообщения
    mailer(message);

    // Отправляем сообщение об успешном изменение пользователя
    res.json({ message: 'Пользователь успешно изменен' });
  } catch (e) {
    console.log(e);
  }
}

// Функция удаления пользователя
async function deleteUser(req, res) {
  try {
    // Поиск пользователя по айди
    const user = await User.findById(req.params.id);

    // Проверка, если пользователя нету выводим ошибку
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Удаление пользователя
    await user.remove();

    // Отправляем сообщение об успешном удаление
    res.json({ message: 'Пользователь удален' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Delete error' });
  }
}

module.exports = { registration, getUsers, deleteUser, updateUser, getOneUser };
