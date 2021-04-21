const Router = require('express');
const router = new Router();
const postsController = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');

router.get('/posts', authMiddleware, postsController.findAll);
router.post('/posts', userMiddleware, postsController.create);

router.get('/posts/:id', authMiddleware, postsController.findOne);
router.patch('/posts/:id', userMiddleware, postsController.update);
router.delete('/posts/:id', adminMiddleware, postsController.destroy);

module.exports = router;
