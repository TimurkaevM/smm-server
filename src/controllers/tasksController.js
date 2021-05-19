const User = require('../models/User');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

async function find(req, res) {
  try {
    const tasks = await Task.find().populate('executor', 'name surname');

    res.status(200).json(tasks);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при получение задач!' });
  }
}

async function findOne(req, res) {
  try {
    const tasks = await Task.find().populate('executor', 'name surname');

    const filteredTasks = tasks.filter((task) =>
      task.executor.equals(req.params.userID),
    );

    res.status(200).json(filteredTasks);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при получение задач!' });
  }
}

async function create(req, res) {
  try {
    // Получаем все ошибки валидности, если они есть, выводим их
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(417)
        .json({ message: 'Ошибка при создание задачи', errors });
    }

    const { message, time } = req.body;

    const user = await User.findById(req.params.userID);

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

async function destroy(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    // Проверка, если задача не найдена выводим ошибку
    if (!task) {
      return res.status(404).json({ message: 'Задача не найден' });
    }

    // Удаление задачи
    await task.remove();

    res.status(200).json({ message: 'Задача успешно удалена' });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при добавление задачи!' });
  }
}

async function updateByAdmin(req, res) {
  try {
    const { message, time, inWork, completed } = req.body;

    const task = await Task.findById(req.params.id);

    // Проверка, если задача не найдена выводим ошибку
    if (!task) {
      return res.status(404).json({ message: 'Задача не найден' });
    }

    // Изменение поста админом
    await task.update({
      message: !message ? task.message : message,
      time: !time ? task.time : time,
      executor: task.executor,
      inWork: !inWork ? task.inWork : inWork,
      completed: !completed ? task.completed : completed,
    });

    // Отправляем сообщение об успехе операции
    res.status(200).json({ message: 'Задача изменена' });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при изменение задачи!' });
  }
}

async function updateByUser(req, res) {
  try {
    const { inWork, completed } = req.body;

    // Находим задачу по id
    const task = await Task.findById(req.params.id);

    // Находим исполнителя по userID
    const user = await User.findById(req.params.userID);

    // Проверка, если задача не найдена выводим ошибку
    if (!task) {
      return res.status(404).json({ message: 'Задача не найден' });
    }

    // Проверка, если исполнитель не найден выводим ошибку
    if (!user) {
      return res.status(404).json({ message: 'Исполнитель не найден' });
    }

    // Проверка. Только исполнитель этой задачи может изменить ее
    if (!post.executor._id.equals(user._id)) {
      {
        return res
          .status(403)
          .json({ message: 'Вы не можете редактировать эту задачу' });
      }
    }

    // Изменение поста пользователем
    await task.update({
      message: task.message,
      time: task.time,
      executor: task.executor,
      inWork: !inWork ? task.inWork : inWork,
      completed: !completed ? task.completed : completed,
    });

    // Отправляем сообщение об успехе операции
    res.status(200).json({ message: 'Задача изменена' });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при изменение задачи!' });
  }
}

module.exports = {
  find,
  findOne,
  create,
  updateByAdmin,
  updateByUser,
  destroy,
};
