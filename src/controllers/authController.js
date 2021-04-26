const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Геннерация токена
const generateAccesToken = (id, role) => {
  const payload = {
    id,
    role,
  };

  return jwt.sign(payload, process.env.MY_SECRET_KEY);
};

class authController {
  //Фунция авторизации
  async login(req, res) {
    try {
      //Получение данных
      const { username, password } = req.body;

      //Поиск пользователя в БД
      const user = await User.findOne({ username });

      //Проверка, если пользователь не найден выводим ошибку
      if (!user) {
        return res.status(404).json({ message: `Пользователь не найден` });
      }

      //Делаем проверку закэшированого пароля и пороля полученнего с запроса
      const validPassword = bcrypt.compareSync(password, user.password);

      //Проверка, если пароли не совпадают, выводим ошибку
      if (!validPassword) {
        return res.status(401).json({ message: `Неверный пароль` });
      }

      //Генерируем токен, передаем парамметрами айди пользователя и его роль
      const token = generateAccesToken(user._id, user.role);

      //Отправляем запрос с токеном и информацией о пользователе
      return res.status(200).json({
        token,
        user: {
          name: user.name,
          surname: user.surname,
          mail: user.mail,
          role: user.role,
        },
      });
    } catch (e) {
      //Ловим ошибки
      console.log(e);
      res.status(401).json({ message: 'Login error' });
    }
  }

  // Функция проверки токена
  async checkToken(req, res) {
    try {
      //Принимаем токен отправленный в запросе
      const { token } = req.body;
      //Принимаем токен из заголовков
      const findToken = req.headers.authorization.split(' ')[1];
      req.user = jwt.verify(findToken, process.env.MY_SECRET_KEY);

      //Проверка, полученныз токенов
      if (token !== req.user.token) {
        return res.status(401).json({ message: 'Error' });
      }

      return res.status(200).json(true);
    } catch (e) {
      //Ловим ошибки
      console.log(e);
      res.status(401).json({ message: 'Check error' });
    }
  }
}

module.exports = new authController();
