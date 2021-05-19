const Router = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const { check } = require('express-validator');

const router = new Router();

router.get('/tasks', [authMiddleware, adminMiddleware], tasksController.find);
router.get(
  '/users/:userID/tasks',
  [authMiddleware, adminMiddleware],
  tasksController.findOne,
);

router.post(
  '/users/:userID/tasks',
  [
    check('message', 'Комментарий не может быть пустым').notEmpty(),
    authMiddleware,
    adminMiddleware,
  ],
  tasksController.create,
);

router.patch(
  '/tasks/:id',
  [authMiddleware, adminMiddleware],
  tasksController.updateByAdmin,
);
router.patch(
  '/users/:userID/tasks/:id',
  [authMiddleware, userMiddleware],
  tasksController.updateByUser,
);

router.delete(
  '/tasks/:id',
  [authMiddleware, adminMiddleware],
  tasksController.destroy,
);

module.exports = router;
