const Recaptcha = require('express-recaptcha').RecaptchaV2;

const SITE_KEY = "6LfAaOoUAAAAANGrwHgzNt7YtgP61EFJXOgRcV_I";
const SECRET_KEY = "6LfAaOoUAAAAAJzGxTxFbdpxH2DGIKxYUWJxzLXi";

var recaptcha = new Recaptcha(SITE_KEY, SECRET_KEY);
module.exports = recaptcha;