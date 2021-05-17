const Router = require('express');
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router({ mergeParams: true });

router.get('/', authMiddleware, commentsController.findAll);
router.post('/', authMiddleware, commentsController.create);

module.exports = router;
