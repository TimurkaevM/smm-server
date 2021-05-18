const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

async function find(req, res) {
  try {
    const comment = await Comment.find().populate('author', 'username');

    const filteredComments = comment.filter((item) =>
      item.post.equals(req.params.postID),
    );

    res.status(200).json(filteredComments);
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .json({ message: 'Ошибка при получение комментариев!' });
  }
}

async function create(req, res) {
  try {
    const { message } = req.body;

    const post = await Post.findById(req.params.postID);
    console.log(post);
    console.log(req.params.postID);

    const user = await User.findById(req.user.id);
    console.log(req.user.id);

    const comment = new Comment({
      message,
      author: { ...user },
      post: { ...post },
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

module.exports = { find, create };
