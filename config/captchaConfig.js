const Recaptcha = require('express-recaptcha').RecaptchaV2;
const captchaCredentials = require('./captchaCredentials');

const SITE_KEY = captchaCredentials.SITE_KEY;  // YOUR SITE KEY
const SECRET_KEY = captchaCredentials.SECRET_KEY;  //YOUR SECRET KEY

var recaptcha = new Recaptcha(SITE_KEY, SECRET_KEY);
module.exports = recaptcha;