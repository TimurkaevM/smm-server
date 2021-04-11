const User = require('../models/User');
const Role = require('../models/Role');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

class postsController {
  async findAll(req, res) {
    try {
      const post = await Post.find().populate('author', 'surname name mail');

      res.json(post);
    } catch (e) {
      console.log(e);
      res.status(403).json({ message: 'Eror...' });
    }
  }

  async create(req, res) {
    try {
      const { title, text } = req.body;
      const post = await Post.findOne({ title });

      if (post) {
        return res
          .status(400)
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
      res.status(403).json({ message: 'Eror...' });
    }
  }
}

module.exports = new postsController();
