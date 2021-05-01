const Router = require('express');
const router = new Router();
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post(
  '/',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check(
      'password',
      'пароль не может быть меньше 4 и больше 15 символов',
    ).isLength({ min: 4, max: 15 }),
    authMiddleware,
    adminMiddleware,
  ],
  usersController.registration,
);

router.get('/', authMiddleware, usersController.getUsers);

router.get('/:id', authMiddleware, usersController.getOneUser);

router.patch(
  '/:id',
  [authMiddleware, adminMiddleware],
  usersController.updateUser,
);

router.delete('/:id', [authMiddleware], usersController.deleteUser);

module.exports = router;
