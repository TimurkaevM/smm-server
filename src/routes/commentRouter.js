const Router = require('express');
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = new Router();

// Получение всех комментариев поста (все)
router.get('/:postID/comments', authMiddleware, commentsController.findAll);

// Добавление комментария к посту(все)
router.post(
  '/:postID/comments',
  [
    check('message', 'Комментарий не может быть пустым').notEmpty(),
    authMiddleware,
  ],
  commentsController.createComment,
);

// Изменения комментария(все)
router.patch(
  '/:postID/comments/:id',
  [authMiddleware],
  commentsController.updateComment,
);

// Удаления комментария(все)
router.delete(
  '/:postID/comments/:id',
  [authMiddleware],
  commentsController.destroy,
);

module.exports = router;
