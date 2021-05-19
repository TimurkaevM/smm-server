const Router = require('express');
const postsController = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const { check } = require('express-validator');

const router = new Router();

// Получение всех постов(все)
router.get('/', authMiddleware, postsController.findAll);
// Получение одного поста(все)
router.get('/:id', authMiddleware, postsController.findOne);

// Добавление поста(работник)
router.post(
  '/',
  [
    check('title', 'Заголовок поста не может быть пустым').notEmpty(),
    check('text', 'Содержимое поста не может быть пустым').notEmpty(),
    authMiddleware,
    userMiddleware,
  ],
  postsController.create,
);

// Изменение поста(работник)
router.patch(
  '/:id',
  [authMiddleware, userMiddleware],
  postsController.updatePost,
);

// Удаление поста(все)
router.delete('/:id', authMiddleware, postsController.destroy);

module.exports = router;
