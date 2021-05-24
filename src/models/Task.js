const { Schema, model } = require('mongoose');

const Task = new Schema(
  {
    message: { type: String, required: true },
    executor: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    inWork: { type: Boolean, required: true, default: true },
    completed: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Task', Task);
