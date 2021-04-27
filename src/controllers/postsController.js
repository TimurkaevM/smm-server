const User = require('../models/User');
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// Функция получения всех постов
async function findAll(req, res) {
  try {
    // Поиск всех постов в БД
    const post = await Post.find().populate('author', 'surname name mail');

    // Отправляем в запросе найденные посты
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: 'Error...' });
  }
}

// Функция получения одного поста
async function findOne(req, res) {
  try {
    // Поиск одного поста в БД по айди
    const post = await Post.findById(req.params.id).populate(
      'author',
      'surname name mail',
    );

    // Проверка, если пост не найден выводим ошибку
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Отправляем в запросе найденный пост
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: 'Error...' });
  }
}

// Функция добавления поста
async function create(req, res) {
  try {
    // Получаем все ошибки валидности, если они есть, выводим их
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(417)
        .json({ message: 'Ошибка при создание поста', errors });
    }

    // Получаем заголовок и текс поста
    const { title, text } = req.body;
    // Находим пост по одному параметру title
    const post = await Post.findOne({ title });

    // Проверка, есть ли пост с таким заголовком
    if (post) {
      return res
        .status(409)
        .json({ message: 'Пост с таким заголовком уже существует' });
    }

    // Получаем пользователя создавшего пост
    const user = await User.findOne({ _id: req.user.id });

    // Создаем новый пост с информацией о пользователе
    const newPost = new Post({
      title,
      text,
      author: { ...user },
    });

    // Сохраняем пост в БД
    await newPost.save();

    // Отправляем сообщение об успешном добавлении поста
    res.json({ message: 'Пост успешно добавлен' });
  } catch (e) {
    console.log(e);
    res.status(409).json({ message: 'Error...' });
  }
}

// Функция изменения поста
async function updatePost(req, res) {
  try {
    //Получаем данные
    const { title, text, draft } = req.body;

    // Находим пост по айди
    const post = await Post.findById(req.params.id).populate(
      'author',
      'surname name mail',
    );

    // Находим пользователя по айди
    const user = await User.findOne({ _id: req.user.id });

    // Проверка, если пост не найден выводим ошибку
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Проверка. Только пользователь добавивший пост и админ могут изменять его
    if (post.author._id !== user._id && user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Вы не можете редактировать этот пост' });
    }

    // Изменение поста
    await post.update({
      text: !text ? post.text : text,
      title: !title ? post.title : title,
      draft: draft === null ? post.draft : draft,
      author: post.author,
    });

    // Отправляем сообщение об успехе операции
    res.status(200).json({ message: 'Пост изменен' });
  } catch (e) {
    console.log(e);
    res.status(409).json({ message: 'Error...' });
  }
}

// Функция удаления поста
async function destroy(req, res) {
  try {
    // Находим пост по айди
    const post = await Post.findById(req.params.id);

    // Находим пользователя по айди
    const user = await User.findOne({ _id: req.user.id });

    // Проверка, если пост не найден выводим ошибку
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Проверка. Только пользователь добавивший пост и админ могут удалять его
    if (post.author._id !== user._id && user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Вы не можете удалить этот пост' });
    }

    // Удаление поста
    await post.remove();

    // Отправляем сообщение об успехе операции
    return res.json({ message: 'Пост успешно удален' });
  } catch (e) {
    console.log(e);
    res.status(409).json({ message: 'Delete error' });
  }
}

module.exports = { findAll, findOne, create, updatePost, destroy };
