const { Schema, model } = require('mongoose');

const Comment = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Comment', Comment);
