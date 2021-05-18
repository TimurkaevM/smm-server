const Router = require('express');
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

router.get('/posts/:postID/comments', authMiddleware, commentsController.find);
router.post(
  '/posts/:postID/comments',
  authMiddleware,
  commentsController.create,
);

module.exports = router;
