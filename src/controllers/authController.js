const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
