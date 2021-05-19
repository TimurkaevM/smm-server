const Router = require('express');
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = new Router();

router.get('/:postID/comments', authMiddleware, commentsController.findAll);

router.post(
  '/:postID/comments',
  [
    check('message', 'Комментарий не может быть пустым').notEmpty(),
    authMiddleware,
  ],
  commentsController.createComment,
);

router.patch(
  '/:postID/comments/:id',
  [authMiddleware],
  commentsController.updateComment,
);

router.delete(
  '/:postID/comments/:id',
  [authMiddleware],
  commentsController.destroy,
);

module.exports = router;
