const { Schema, model } = require('mongoose');

//Схема пользователей
const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  mail: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = model('User', User);
