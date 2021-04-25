const { Schema, model } = require('mongoose');

//Схема постов
const Post = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  text: { type: String, required: true },
  title: { type: String, required: true },
  draft: { type: Boolean, required: true, default: false },
});

module.exports = model('Post', Post);
