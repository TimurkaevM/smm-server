const Router = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

router.post('/login', authController.login);
router.post('/autologin', authMiddleware, authController.checkToken);

module.exports = router;
