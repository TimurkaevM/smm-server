const User = require('../models/User');
const Role = require('../models/Role');
const Post = require('../models/Post');

class postsController {
  async findAll(req, res) {
    try {
      const user = await Post.findOne();

      res.json({ message: 'OK' });
    } catch (e) {
      console.log(e);
      res.status(403).json({ message: 'Eror...' });
    }
  }

  async create(req, res) {
    try {
      const { title, text, _id } = req.body;
      const post = await Post.findOne({ title });

      if (post) {
        return res
          .status(400)
          .json({ message: 'Пост с таким заголовком уже существует' });
      }
      const newPost = new Post({
        title,
        text,
        author: req.user._id,
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
