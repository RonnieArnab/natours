const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router.route('/').get(userController.getAllUser).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.deleteUser);

module.exports = router; 