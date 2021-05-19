const Router = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

// Авторизация(все)
router.post('/login', authController.login);
// Проверка токена
router.post('/autologin', authMiddleware, authController.checkToken);

module.exports = router;
