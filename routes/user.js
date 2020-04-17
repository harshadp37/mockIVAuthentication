const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');

router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);
router.get('/sign-out', userController.signOut);
router.get('/forgot-password', userController.forgotPassword);
router.get('/password-reset/:token', userController.verifyToken);

router.post('/sign-up', userController.register);
router.post('/sign-in', userController.login);
router.post('/forgot-password', userController.sendResetLink);
router.post('/password-reset/:token', userController.changePassword);

module.exports = router;