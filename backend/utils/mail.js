const nodemailer = require('nodemailer');

exports.generateOTP = (otp_length = 6) => {
    let OTP = '';

    for(let i = 0; i < otp_length; i++) {
        OTP += Math.round(Math.random() * 9)
    }

    return OTP;
}

exports.generateMailTransporter = () => {

    return nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f07dd8badb7a06",
          pass: "874428ff71d787"
        }
    });

}