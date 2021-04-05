const { Schema, model } = require('mongoose');

const Post = new Schema({
  // author: [{ type: Object, required: true, ref: 'User' }],
  // author: { type: String, required: true},
  title: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = model('Post', Post);
