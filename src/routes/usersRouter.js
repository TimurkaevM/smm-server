const Router = require('express');
const router = new Router();
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post(
  '/registration',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check(
      'password',
      'пароль не может быть меньше 4 и больше 10 символов',
    ).isLength({ min: 4, max: 10 }),
  ],
  usersController.registration,
);

router.get('/users', authMiddleware, usersController.getUsers);

module.exports = router;
