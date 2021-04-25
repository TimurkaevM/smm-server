const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/autologin', authController.checkToken);

module.exports = router;
