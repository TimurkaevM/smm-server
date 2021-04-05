const { Schema, model } = require('mongoose');

const User = new Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, ref: 'Role' }],
});

module.exports = model('User', User);
