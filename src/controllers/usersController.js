const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();

class usersController {
  async registration(req, res) {
    try {
      const errros = validationResult(req);

      if (!errros.isEmpty()) {
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
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({
        username,
        password: hashPassword,
        name,
        surname,
        mail,
        roles: [userRole.value],
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
