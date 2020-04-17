const passwordResetMailer = require('./../mailer/passwordReset');
const agenda = require('../config/agenda');

agenda.define('resetTokenMail', (job, done)=>{
    passwordResetMailer.sendResetLink(job.attrs.data);
    done();
})
