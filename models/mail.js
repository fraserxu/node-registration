var nodemailer = require('nodemailer');

var auth_email = "user@gmail.com"
  , auth_password = "password";

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: auth_email,
        pass: auth_password
    }
});

exports.smtpTransport = smtpTransport;
