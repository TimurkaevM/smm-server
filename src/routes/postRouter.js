const Router = require('express');
const router = new Router();
const postsController = require('../controllers/postsController');

router.get('/posts', postsController.findAll);
router.post('/posts', postsController.create);

module.exports = router;
