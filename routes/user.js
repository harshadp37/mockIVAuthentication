const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const recaptcha = require('./../config/captchaConfig');

// SEND SIGN UP, SIGN IN, SING OUT TEMPLATES
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.get('/sign-out', userController.signOut);

// SEND FORGOT PASSWORD TEMPLATE
router.get('/forgot-password', userController.forgotPassword);

// SEND RESET PASSWORD TEMPLATE BY VERIFYING TOKEN
router.get('/password-reset/:token', userController.verifyResetToken);

// SEND RESET PASSWORD TEMPLATE BY VERIFYING TOKEN
router.get('/account-verification/:token', userController.verifyAccountToken);

// SIGN UP AND SIGN IN FOR USER
router.post('/sign-in', recaptcha.middleware.verify, userController.login);
router.post('/sign-up', recaptcha.middleware.verify, userController.register);

// SEND RESET PASSWORD TOKEN USING MAIL
router.post('/forgot-password', userController.sendResetLink);

// CHANGE PASSWORD BY VERIFYING TOKEN
router.post('/password-reset/:token', userController.changePassword);

module.exports = router;