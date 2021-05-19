const Router = require('express');
const postsController = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const { check } = require('express-validator');

const router = new Router();

router.get('/', authMiddleware, postsController.findAll);
router.get('/:id', authMiddleware, postsController.findOne);

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

router.patch(
  '/:id',
  [authMiddleware, userMiddleware],
  postsController.updatePost,
);

router.delete('/:id', authMiddleware, postsController.destroy);

module.exports = router;
