const Router = require('express');

const router = Router();

router.use('/', require('./authRouter'));
router.use('/posts', require('./postRouter'));
router.use('/users', require('./usersRouter'));
router.use('/posts', require('./commentRouter'));
router.use('/', require('./tasksRouter'));

module.exports = router;
