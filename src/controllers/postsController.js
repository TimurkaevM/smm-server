const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class postsController {
  async findAll(req, res) {
    try {
      const post = await Post.find().populate('author', 'surname name mail');

      res.status(200).json(post);
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: 'Eror...' });
    }
  }

  async findOne(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate(
        'author',
        'surname name mail',
      );

      res.status(200).json(post);
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: 'Eror...' });
    }
  }

  async create(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(417)
          .json({ message: 'Ошибка при создание поста', errors });
      }

      const { title, text } = req.body;
      const post = await Post.findOne({ title });

      if (post) {
        return res
          .status(409)
          .json({ message: 'Пост с таким заголовком уже существует' });
      }

      const token = req.headers.authorization.split(' ')[1];
      req.user = jwt.verify(token, process.env.MY_SECRET_KEY);

      const user = await User.findById(req.user.id);

      const newPost = new Post({
        title,
        text,
        author: { ...user },
      });
      await newPost.save();
      return res.json({ message: 'Пост успешно добавлен' });
    } catch (e) {
      console.log(e);
      res.status(409).json({ message: 'Eror...' });
    }
  }

  async updatePost(req, res) {
    try {
      const { title, text, draft } = req.body;

      const post = await Post.findById(req.params.id).populate(
        'author',
        'surname name mail',
      );

      const user = await User.findOne({ _id: req.user.id });

      if (!post) {
        return res.status(404).json({ message: 'Пост не найден' });
      }

      if (post.author._id !== user._id && user.role !== 'ADMIN') {
        return res
          .status(403)
          .json({ message: 'Вы не можете редактировать этот пост' });
      }

      await post.update({
        text: !text ? post.text : text,
        title: !title ? post.title : title,
        draft: draft === null ? post.draft : draft,
        author: post.author,
      });

      return res.status(200).json({ message: 'Пост изменен' });
    } catch (e) {
      console.log(e);
      res.status(409).json({ message: 'Eror...' });
    }
  }

  async destroy(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      const user = await User.findOne({ _id: req.user.id });

      if (!post) {
        return res.status(404).json({ message: 'Пост не найден' });
      }

      if (post.author._id !== user._id && user.role !== 'ADMIN') {
        return res
          .status(403)
          .json({ message: 'Вы не можете удолить этот пост' });
      }

      await post.remove();

      return res.json({ message: 'Пост успешно удален' });
    } catch (e) {
      console.log(e);
      res.status(409).json({ message: 'Deleting error' });
    }
  }
}

module.exports = new postsController();
