const express = require('express');
const { adminLogin, getUsers } = require('../controllers/adminController');
const router = express.Router();

router.post('/', adminLogin);
router.get('/users', getUsers);

module.exports = router;
