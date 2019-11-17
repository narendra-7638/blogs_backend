const router = require('express').Router();
const blogs = require('./../controller/blog');
const Auth = require('./../middleware/auth');

router.use(Auth.verify);

router.get('/blogs', blogs.getList);

router.get('/blogs/:id', blogs.get);

router.post('/blogs', blogs.create);

router.put('/blogs/:id', blogs.edit);

router.delete('/blogs/:id', blogs.delete);

module.exports = router;