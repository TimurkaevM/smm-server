const Router = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const { check } = require('express-validator');

const router = new Router();

// Получение всех задач(админ)
router.get('/tasks', [authMiddleware, adminMiddleware], tasksController.find);
// Получение всех задач одного исполнителя(все)
router.get('/users/:userID/tasks', authMiddleware, tasksController.findOne);

// Добавление задачи(админ)
router.post(
  '/users/:userID/tasks',
  [
    check('message', 'Задача не может быть пустой').notEmpty(),
    authMiddleware,
    adminMiddleware,
  ],
  tasksController.create,
);

// Изменение задачи(админ)
router.patch(
  '/tasks/:id',
  [authMiddleware, adminMiddleware],
  tasksController.updateByAdmin,
);
// Изменение задачи(исполнитель)
router.patch(
  '/users/:userID/tasks/:id',
  [authMiddleware, userMiddleware],
  tasksController.updateByUser,
);

// Удаление задачи(админ)
router.delete(
  '/tasks/:id',
  [authMiddleware, adminMiddleware],
  tasksController.destroy,
);

module.exports = router;
