const Router = require('express');
const router = new Router();
const postsController = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const { check } = require('express-validator');

router.get('/posts', authMiddleware, postsController.findAll);
router.post(
  '/posts',
  [
    check('title', 'Заголовок поста не может быть пустым').notEmpty(),
    check('text', 'Содержимое поста не может быть пустым').notEmpty(),
    authMiddleware,
    userMiddleware,
  ],
  postsController.create,
);

router.get('/posts/:id', authMiddleware, postsController.findOne);
router.patch('/posts/:id', authMiddleware, postsController.updatePost);
router.delete('/posts/:id', authMiddleware, postsController.destroy);

module.exports = router;
