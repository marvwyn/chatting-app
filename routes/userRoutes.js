const express = require('express');

const router = express.Router();

const { signin, signup, logout } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth');
const { checkTokenMiddleware } = require('../middlewares/tokenMiddleWare');

router.get('/signin', signin.get);
router.post('/signin',authenticateUser, signin.post);
router.get('/signup', signup.get);
router.post('/signup', signup.post);
router.post('/logout',checkTokenMiddleware, logout);

module.exports = router;