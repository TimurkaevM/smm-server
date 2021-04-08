const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');

//делаем пост запрос по адрессу логин и принимаем колбэк функцию из контролера

router.post('/login', authController.login);

module.exports = router;
