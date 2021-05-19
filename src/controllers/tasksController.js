const User = require('../models/User');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Функция получения всех задач
async function find(req, res) {
  try {
    // Находим все задачи в БД
    const tasks = await Task.find().populate('executor', 'name surname');

    // Отправляем все найденные задачи
    res.status(200).json(tasks);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при получение задач!' });
  }
}

// Функция получения задач одного исполнителя
async function findOne(req, res) {
  try {
    // Находим все задачи исполнителя
    const tasks = await Task.find({ executor: req.params.userID }).populate(
      'executor',
      'name surname',
    );

    // Отправляем найденные задачи
    res.status(200).json(tasks);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при получение задач!' });
  }
}

// Функция добавления задач
async function create(req, res) {
  try {
    // Получаем все ошибки валидности, если они есть, выводим их
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(417)
        .json({ message: 'Ошибка при создание задачи', errors });
    }

    // Получаем данные
    const { message, time } = req.body;

    // Находим исполнителя
    const user = await User.findById(req.params.userID);

    // Добавляем задачу
    const task = new Task({
      message,
      time,
      executor: { ...user },
    });

    // Сохраняем задачу в БД
    await task.save();

    // Отправляем сообщение об успехе операции
    res.status(200).json({ message: 'Задача успешно добавлена' });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при добавление задачи!' });
  }
}

// Функция удаления задачи
async function destroy(req, res) {
  try {
    // Находим задачу по id
    const task = await Task.findById(req.params.id);

    // Проверка, если задача не найдена выводим ошибку
    if (!task) {
      return res.status(404).json({ message: 'Задача не найден' });
    }

    // Удаление задачи
    await task.remove();

    // Отправляем сообщение об успехе операции
    res.status(200).json({ message: 'Задача успешно удалена' });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: 'Ошибка при добавление задачи!' });
  }
}

// Функция изменения задачи админом ( админ может изменить все значения задачи )
async function updateByAdmin(req, res) {
  try {
    // Получаем данные
    const { message, time, inWork, completed } = req.body;

    // Находим задачу
    const task = await Task.findById(req.params.id);

    // Проверка, если задача не найдена выводим ошибку
    if (!task) {
      return res.status(404).json({ message: 'Задача не найден' });
    }

    // Изменение задачи админом
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

// Функция изменения задачи исполнителем (исполнитель может изменить только 2 значения(inWork и completed))
async function updateByUser(req, res) {
  try {
    // Получаем данные
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

    // Проверка. Только исполнитель данной задачи может изменить ее
    if (!post.executor._id.equals(user._id)) {
      {
        return res
          .status(403)
          .json({ message: 'Вы не можете редактировать эту задачу' });
      }
    }

    // Изменение задачи пользователем
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
