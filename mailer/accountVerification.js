const transporter = require('./../config/mailConfig');
const ejs = require('ejs');
const path = require('path');
const config = require('./../config/config');

// SEND MAIL TO VERIFY EAMIL ID
module.exports.sendVerificationLink = async (data)=>{
    data.hostName = config.hostName;

    // GET ACCOUNT VERIFICATION MAIL TEMPLATE
    const accountVerificationTemplate = await ejs.renderFile(path.join(__dirname, '../views/mailer/accountVerification.ejs'), data);

    // SEND MAIL
    transporter.sendMail({
        from: 'Auth',
        to: data.email,
        subject: 'Account Verification',
        html: accountVerificationTemplate
    }, (err, info)=>{
        if(err){
            console.log("Error While Sending Account Verification Mail. " + err);
        }else{
            console.log("Mail Sent.");
            console.log(info);
        }
    })
}