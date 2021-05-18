const Router = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

router.get('/tasks', authMiddleware, tasksController.find);
router.post('/users/:userID/tasks', authMiddleware, tasksController.create);

module.exports = router;
