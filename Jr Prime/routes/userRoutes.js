const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const router = express.Router();

router.route('/signup')
.post(authController.signup);

router.route('/login')
.post(authController.login);

router.route('/forgotPassword')
.post(authController.forgotPassword);

router.route('/resetPassword/:resetToken')
.patch(authController.resetPassword);

router.route('/updatePassword')
.patch(authController.protect,authController.updatePassword);

router.route('/updateMe')
.patch(authController.protect,userController.updateMe);

router.route('/deleteMe')
.patch(authController.protect,authController.restrictTo('user'),userController.deleteMe);

router.route('/me')
.get(authController.protect,userController.getMe);

router.route('/')
.get(authController.protect,authController.restrictTo('admin'),userController.getAllUser);

router.route('/:id')
.get(authController.protect,authController.restrictTo('admin'),userController.getUser);
module.exports = router;

