const nodemailer = require('nodemailer');
const mailCredentials = require('./mailCredentials');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: mailCredentials.user,
        pass: mailCredentials.pass 
    }
});

module.exports = transporter;