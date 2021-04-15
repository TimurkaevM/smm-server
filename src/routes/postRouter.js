const Router = require('express');
const router = new Router();
const postsController = require('../controllers/postsController');
/**
 * делаем get and post  запрос по адрессу posts и принимаем Функции из контролера
 */

router.get('/posts', postsController.findAll);
router.post('/posts', postsController.create);

router.get('/posts/:id', postsController.findOne);
router.patch('/posts/:id', postsController.update);
router.delete('/posts/:id', postsController.destroy);

module.exports = router;
