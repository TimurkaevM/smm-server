const Router = require('express');
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = new Router();

// Добавление работника(админ)
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

// Получение всех работников(все)
router.get('/', authMiddleware, usersController.getUsers);
//Получение одного работника
router.get('/:id', authMiddleware, usersController.getOneUser);

// Изменение работника(админ)
router.patch(
  '/:id',
  [authMiddleware, adminMiddleware],
  usersController.updateUser,
);

// Удаление работника(админ)
router.delete(
  '/:id',
  [authMiddleware, adminMiddleware],
  usersController.deleteUser,
);

module.exports = router;
