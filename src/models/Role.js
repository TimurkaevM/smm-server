const { Schema, model } = require('mongoose');

/**
 * создаем схему ролей
 * экспортируем модель
 */

const Role = new Schema({
  value: { type: String, unique: true, default: 'USER' },
});

module.exports = model('Role', Role);
