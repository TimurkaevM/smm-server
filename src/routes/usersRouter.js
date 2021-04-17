const Router = require('express');
const router = new Router();
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post(
  '/users',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check(
      'password',
      'пароль не может быть меньше 4 и больше 10 символов',
    ).isLength({ min: 4, max: 15 }),
  ],
  usersController.registration,
);

router.get('/users', authMiddleware, usersController.getUsers);

router.get('/users/:id', usersController.getOneUser);

router.patch('/users/:id', usersController.updateUser);

router.delete('/users/:id', usersController.deleteUser);

module.exports = router;
