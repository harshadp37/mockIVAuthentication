const accountVerification = require('./../mailer/accountVerification');
const agenda = require('../config/agenda');

agenda.define('accountVerificationMail', (job, done)=>{
    accountVerification.sendVerificationLink(job.attrs.data);
    done();
})