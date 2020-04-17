const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const recaptcha = require('./../config/captchaConfig');

// SEND SIGN UP, SIGN IN, SING OUT TEMPLATES
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.get('/sign-out', userController.signOut);

// SIGN UP AND SIGN IN FOR USER
router.post('/sign-in', recaptcha.middleware.verify, userController.login);
router.post('/sign-up', recaptcha.middleware.verify, userController.register);

/*
1. SEND ACCOUNT VERIFICATION TEMPLATE
2. SEND ACCOUNT VERIFICATION LINK USING MAIL
3. VERIFY ACCOUNT VERIFICATION TOKEN */
router.get('/account-verification', userController.accountVerification);
router.post('/account-verification', userController.sendAccountVerificationLink);
router.get('/account-verification/:token', userController.verifyAccountToken);

/* 
1. FORGOT PASSWORD TEMPLATE
2. SEND RESET PASSWORD LINK USING MAIL */
router.get('/forgot-password', userController.forgotPassword);
router.post('/forgot-password', userController.sendResetLink);

/* 
1. SEND RESET PASSWORD TEMPLATE BY VERIFYING TOKEN
2. CHANGE PASSWORD BY VERIFYING TOKEN */
router.get('/password-reset/:token', userController.verifyResetToken);
router.post('/password-reset/:token', userController.changePassword);

module.exports = router;