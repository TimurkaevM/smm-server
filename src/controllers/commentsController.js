const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

async function findAll(req, res) {
  try {
    const comments = await Comment.find().populate('author', 'username');

    const filteredComments = comments.filter((comment) =>
      comment.post.equals(req.params.postID),
    );

    res.status(200).json(filteredComments);
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .json({ message: 'Ошибка при получение комментариев!' });
  }
}

async function createComment(req, res) {
  try {
    // Получаем все ошибки валидности, если они есть, выводим их
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(417)
        .json({ message: 'Ошибка при создание комментария', errors });
    }

    const { message } = req.body;

    const post = await Post.findById(req.params.postID);

    const user = await User.findById(req.user.id);

    const comment = new Comment({
      message,
      author: { ...user },
      postId: { ...post },
    });

    await comment.save();

    res.status(200).json({ message: 'Комментарий успешно добавлен' });
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .json({ message: 'Ошибка при добавление комментария!' });
  }
}

// Функция изменения поста
async function updateComment(req, res) {
  try {
    //Получаем данные
    const { message } = req.body;

    // Находим комментарий по айди
    const comment = await Comment.findById(req.params.id);

    // Находим пользователя по айди
    const user = await User.findById(req.user.id);

    // Проверка, если комментарий не найден выводим ошибку
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }

    // Проверка. Только пользователь добавивший комментарий может изменить его
    if (!comment.author._id.equals(user._id)) {
      return res
        .status(403)
        .json({ message: 'Вы не можете редактировать этот комментарий' });
    }

    // Изменение поста
    await comment.update({
      message: !message ? comment.message : message,
      author: comment.author,
      postId: comment.post,
    });

    // Отправляем сообщение об успехе операции
    res.status(200).json({ message: 'Комментарий изменен' });
  } catch (e) {
    console.log(e);
    res.status(409).json({ message: 'Error...' });
  }
}

// Функция удаления комментария
async function destroy(req, res) {
  try {
    // Находим комментарий по айди
    const comment = await Post.findById(req.params.id);

    // Находим пользователя по айди
    const user = await User.findById(req.user.id);

    // Проверка, если комментарий не найден выводим ошибку
    if (!comment) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Проверка. Только пользователь добавивший комментарий и админ могут удалить его
    if (!comment.author._id.equals(user._id) && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'У вас нет доступа' });
    }

    // Удаление комментария
    await comment.remove();

    // Отправляем сообщение об успехе операции
    return res.json({ message: 'Комментарий успешно удален' });
  } catch (e) {
    console.log(e);
    res.status(409).json({ message: 'Delete error' });
  }
}

module.exports = { findAll, createComment, updateComment, destroy };
