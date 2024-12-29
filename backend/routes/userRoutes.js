const express = require('express');
const { signUp, verifyEmail, login } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/verify', verifyEmail);
router.post('/login', login);

module.exports = router;
