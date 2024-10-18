const express = require('express');
const router = express.Router();
const  multer = require('../middleware/multer-configprofile')

const userCtrl = require('../controllers/user.controller');

router.post('/signup',multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/admin',multer, userCtrl.createAdmin);
router.post('/logout', userCtrl.logout);

module.exports = router;