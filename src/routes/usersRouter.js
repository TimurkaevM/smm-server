const Router = require('express');
const router = new Router();
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post(
  '/users',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check(
      'password',
      'пароль не может быть меньше 4 и больше 10 символов',
    ).isLength({ min: 4, max: 15 }),
    adminMiddleware,
  ],
  usersController.registration,
);

router.get('/users', adminMiddleware, usersController.getUsers);

router.get('/users/:id', authMiddleware, usersController.getOneUser);

router.patch('/users/:id', adminMiddleware, usersController.updateUser);

router.delete('/users/:id', adminMiddleware, usersController.deleteUser);

module.exports = router;
