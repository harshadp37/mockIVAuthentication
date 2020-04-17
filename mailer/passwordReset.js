const transporter = require('./../config/mailConfig');
const ejs = require('ejs');
const path = require('path');
const config = require('./../config/config');

module.exports.sendResetLink = async (data)=>{
    data.hostName = config.hostName;
    const passwordResetTemplate = await ejs.renderFile(path.join(__dirname, '../views/mailer/passwordReset.ejs'), data);
    transporter.sendMail({
        from: 'Auth <auth@gmail.com>',
        to: data.email,
        subject: 'First Mail',
        html: passwordResetTemplate
    }, (err, info)=>{
        if(err){
            console.log("Error While Sending Mail. " + err);
        }else{
            console.log("Message Sent. " + info);
        }
    })
}