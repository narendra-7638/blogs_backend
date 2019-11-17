const router = require('express').Router();
const user = require('./../controller/user');

router.post('/signin', user.signin);

router.post('/signup', user.signup);


module.exports = router;