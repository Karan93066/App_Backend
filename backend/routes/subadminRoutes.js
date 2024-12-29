const express = require('express');
const {
  createSubAdmin,
  getAllSubAdmins,
  updateSubAdmin,
  deleteSubAdmin,
  loginSubAdmin,
} = require('../controllers/subadminController');

const router = express.Router();

router.post('/', createSubAdmin);
router.get('/', getAllSubAdmins);
router.put('/:id', updateSubAdmin);
router.delete('/:id', deleteSubAdmin);
router.post('/subadminlogin', loginSubAdmin);

module.exports = router;
