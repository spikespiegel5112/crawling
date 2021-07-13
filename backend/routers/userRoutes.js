const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/userInfo', UserController.userInfo);
router.get('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', UserController.logout);


module.exports = router;
