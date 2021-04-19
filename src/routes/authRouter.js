const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.get('/login', authMiddleware, authController.getlog);

module.exports = router;
