const { Schema, model } = require('mongoose');

const Post = new Schema({
  author: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
  title: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = model('Post', Post);
