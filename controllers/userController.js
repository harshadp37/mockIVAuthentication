const User = require('./../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const agenda = require('../config/agenda');
require('./../workers/passwordResetWorker');
require('./../workers/accountVerificationWorker');
const recaptcha = require('./../config/captchaConfig');

module.exports.signIn = async (req, res)=>{
    // IF USER IS SIGN IN ALREADY THEN REDIRECT TO HOME
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('sign-in', {title: "Sign In", captcha: res.recaptcha});
}

module.exports.signUp = (req, res)=>{
    // IF USER IS SIGN IN ALREADY THEN REDIRECT TO HOME
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('sign-up', {title: "Sign Up"});
}

module.exports.signOut = (req, res)=>{
    if(req.isAuthenticated()){
        req.logout();
    }
    return res.redirect('/');
}

module.exports.forgotPassword = (req, res)=>{
    // IF USER IS SIGN IN ALREADY THEN REDIRECT TO HOME
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('forgot-password', {title: "Forgot Password"});
}

module.exports.register = async (req, res)=>{
    try {
        // IF USER IS SIGN IN ALREADY THEN REDIRECT TO HOME
        if(req.isAuthenticated()){
            return res.redirect('/');
        }

        /* EMAIL ID AND PASSWORD REQUIRED */
        if(!req.body.email || !req.body.password){
            throw new Error("All Fields(Email & Password) Required.");
        }

        // CATCH CAPTCHA ERROR
        if(req.recaptcha.error){
            return res.json({success: false, message: 'Invalid Captcha.'});
        }
        
        /* GET USER WITH THE HELP OF EAMIL */
        const user = await User.findOne({email: req.body.email});

        /* IF USER ALREADY EXISTS THEN ABORT OPERATION */
        if(user){
            console.error("Account Already exists with this Email ID.");
            throw new Error("Account Already exists with this Email ID.")
        }

        /* IF USER NOT EXISTS THEN CREATE HASH FOR PASSWORD */
        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(req.body.password, salt);

        // CREATE NEW ACCOUNT VERIFICATION TOKEN
        const accountVerificationToken = jwt.sign({email: req.body.email}, config.secret, {expiresIn: '1h'})

        /* CREATE USER */
        await User.create({
            email: req.body.email,
            password: hash,
            accountVerificationToken: accountVerificationToken
        })

        const job = agenda.create('accountVerificationMail', {email: req.body.email, accountVerificationToken: accountVerificationToken});
        await job.save();

        /* SUCCESS RESPONSE */
        return res.json({success: true, message: "User Created Successfully!!"});

    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while saving user.");
        if(e.errors && e.errors.email){
            return res.json({success: false, message: e.errors.email.message});
        }
        return res.json({success: false, message: e.message});
    }
}

module.exports.login = (req, res, next)=>{
    // IF USER IS SIGN IN ALREADY THEN REDIRECT TO HOME
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    /* EMAIL ID AND PASSWORD REQUIRED */
    if(!req.body.email || !req.body.password){
        return res.json({success: false, message: 'All Fields(Email & Password) Required.'});
    }

    // CATCH CAPTCHA ERROR
    if(req.recaptcha.error){
        return res.json({success: false, message: 'Invalid Captcha.'});
    }

    /* AUTHENTICATE USER USING PASSPORT */
    passport.authenticate('local', (err, user, info)=>{
        if(err){
            return res.json({success: false, message: 'Something went wrong.'});
        }
        if(!user){
            return res.json({success: false, message: info.message});
        }
        /* LOGIN USER IF EVERYTHING IS CORRECT */
        req.login(user, (err)=>{
            if(err){
                return res.json({success: false, message: 'Something went wrong'});
            }else{
                return res.json({ success: true, message: "User Authenticated!"});
            }
        })
    })(req, res, next);
}

module.exports.sendResetLink = async (req, res)=>{
    try {
        /* EMAIL ID REQUIRED */
        if(!req.body.email){
            throw new Error("Email ID Required.");
        }
        /* GET USER WITH THE HELP OF EAMIL */
        const user = await User.findOne({email: req.body.email});

        /* IF USER IS NOT EXISTS THEN ABORT OPERATION */
        if(!user){
            console.error("Email ID is not registered.");
            throw new Error("Email ID is not registered.")
        }

        // CREATE RESET TOKEN USING USER ID AND SAVE IT IN DATABASE
        const resetToken = jwt.sign({_id: user._id}, config.secret, {expiresIn: '30m'});

        user.passwordResetToken = resetToken;
        await user.save();

        // IF USER IS SIGN IN THEN SEND RESET TOKEN IN RESPONSE ELSE SEND RESET TOKEN USING MAIL
        if(req.isAuthenticated()){
            return res.json({success: true, resetToken: resetToken});
        }

        const job = agenda.create('resetTokenMail', {email: user.email, resetToken: resetToken});
        await job.save();

        /* SUCCESS RESPONSE */
        return res.json({success: true, message: "Password Link has been sent to your Email ID which is valid only for 30m."});

    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while Sending Password Reset Link " + e);
        return res.json({success: false, message: e.message});
    }
}

module.exports.verifyResetToken = async (req, res) => {
    try {
        // VERIFY RESET TOKEN
        const decoded = await jwt.verify(req.params.token, config.secret);

        if(!decoded._id){
            throw new Error("Bad Token.");
        }

        // GET USER USING ID PRESENT IN TOKEN
        const user = await User.findById(decoded._id);

        // IF PASSWORD RESET TOKEN IN DATABASE IS NULL THEN THROW ERROR
        if(!user || !user.passwordResetToken || user.passwordResetToken != req.params.token){
            throw new Error("Bad Token.");
        }

        /* SUCCESS RESPONSE */
        return res.render('reset-password', {title: "Reset Password", _id: user._id, email: user.email});
    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while Verifying Password Reset Link " + e);
        return res.redirect('/');
    } 
}

module.exports.verifyAccountToken = async (req, res) => {
    try {
        // VERIFY RESET TOKEN
        const decoded = await jwt.verify(req.params.token, config.secret);
        
        if(!decoded.email){
            throw new Error("Bad Token.");
        }

        // GET USER USING ID PRESENT IN TOKEN
        const user = await User.findOne({email: decoded.email});
        if(!user){
            throw new Error("Bad Token.");
        }

        if(user.verified){
            /* SUCCESS RESPONSE */
            user.accountVerificationToken = null;
            user.verified = true;
            await user.save();
            return res.render('account-verified', {title: "Account Verification", accountVerificationResponse: "Account is Already Verified."});
        }

        // IF ACCOUNT VERIFICATION TOKEN IN DATABASE IS NULL THEN THROW ERROR
        if(!user.accountVerificationToken || user.accountVerificationToken != req.params.token){
            throw new Error("Bad Token");
        }

        // IF TOKEN IS VERIFIED THEN UPDATE THE USER
        user.accountVerificationToken = null;
        user.verified = true;
        await user.save();

        /* SUCCESS RESPONSE */
        return res.render('account-verified', {title: "Account Verification", accountVerificationResponse: "Account has been Verified."});
    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while Verifying Account Verification Link " + e);
        return res.render('account-verified', {title: "Account Verification", accountVerificationResponse: "Bad Token."})
    } 
}

module.exports.changePassword = async (req, res) => {
    try {
        /* PASSWORD REQUIRED */
        if(!req.body.password){
            throw new Error("Password Required.");
        }
        
        // VERIFY RESET TOKEN
        const decoded = await jwt.verify(req.params.token, config.secret);

        if(!decoded._id){
            throw new Error("Bad Token.");
        }

        const user = await User.findById(decoded._id);

        if(!user){
            throw new Error("Bad Token.");
        }

        /* IF USER EXISTS THEN CREATE HASH FOR PASSWORD */
        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(req.body.password, salt);

        /* UPDATE USER PASSWORD AND SET PASSWORD RESET TOKEN TO NULL */
        user.passwordResetToken = null;
        user.password = hash;

        await user.save(); 

        /* SUCCESS RESPONSE */
        return res.json({success: true, message: "Password changed Successfully!!"})
    } catch (e) {
        /* ERROR RESPONSE */
        console.error("Error while updating password " + e);
        return res.json({success: false, message: e.message})
    } 
}

