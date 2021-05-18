const User = require('../models/User');
const Task = require('../models/Task');

async function find(req, res) {
  try {
    const task = await Task.find().populate('executor', 'name surname');

    res.status(200).json(task);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при получение задач!' });
  }
}

async function create(req, res) {
  try {
    const { message, time } = req.body;

    const user = await User.findById(req.user.id);
    console.log(req.params);

    const task = new Task({
      message,
      time,
      executor: { ...user },
    });

    await task.save();

    res.status(200).json({ message: 'Задача успешно добавлена' });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при добавление задачи!' });
  }
}

module.exports = { find, create };
