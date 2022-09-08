const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const EmailVerificationToken = require('../models/emailVerificationToken');
const PasswordResetToken = require('../models/passwordResetToken');
const User = require('../models/user');
const { sendError, generateRandomByte } = require('../utils/helper');
const { generateOTP, generateMailTransporter } = require('../utils/mail');

exports.create = async (req, res) => {

    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if(oldUser) {
        return sendError(res, 'This email is already present in Database');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    let OTP = generateOTP(6);

    const newEmailVerificationToken = new EmailVerificationToken({ owner: newUser._id, token: OTP });
 
    await newEmailVerificationToken.save();

    var transport = generateMailTransporter();

    transport.sendMail({
      from: "verification@reviewapp.com",
      to: newUser.email,
      subject: "Email Verification",
      html: `
        <p>You verification OTP</p>
        <h1>${OTP}</h1>
      `,
    });

    return res.status(201).json({
        message: "Please verify your email. OTP has been sent to your email account.",
        user: {
            id: newUser._id,
            name,
            email
        }
    })
}

exports.verifyEmail = async (req, res) => {

    const { userId, OTP } = req.body;

    if(!isValidObjectId(userId)) {
        return sendError(res, 'Invalid User');
    }

    const user = await User.findById(userId);

    if(!user) {
        return sendError(res, 'User Not Found', 404);
    }

    if(user.isVerified) {
        return sendError(res, 'User is already Verified..!!');
    }

    const token = await EmailVerificationToken.findOne({ owner: userId });

    if(!token) {
        return sendError(res, 'Token Not Found');
    }

    const isValidToken = token.compareToken(OTP);

    if(!isValidToken) {
        return sendError(res, 'OTP is Invalid');
    }

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email',
        html: `
            <h1> Welcome to Our Reviews App </h1>
        `
    });

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            token: jwtToken,
            role: user.role,
            isVerified: user.isVerified
        },
        message: 'Your Email is Verified'
    });
}

exports.resendEmailVerificationToken = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if(!user) {
        return sendError(res, 'User Not Found');
    }

    if(user.isVerified) {
        return sendError(res, 'User is already Verified..!!');
    }

    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId });

    if(alreadyHasToken) {
        await EmailVerificationToken.findByIdAndDelete(alreadyHasToken._id);
    }

    let OTP = generateOTP(6);

    const newEmailVerificationToken = new EmailVerificationToken({ owner: user._id, token: OTP });
 
    await newEmailVerificationToken.save();

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
            <p> Your Verification OTP </p>
            <h1> ${OTP} </h1>
        `
    })

    return res.status(201).json({
        message: "Please check your email. OTP has been sent to your email account."
    })

}

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    if(!email) {
        return sendError(res, 'Email is Missing');
    }

    const user = await User.findOne({ email });

    if(!user) {
        return sendError(res, 'User Not Found', 404);
    }

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });

    if(alreadyHasToken) {
        await PasswordResetToken.findByIdAndDelete(alreadyHasToken._id);
    }

    const token = await generateRandomByte();

    const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token });
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: 'Reset Password Link',
        html: `
            <p> Click Here To Reset Password </p>
            <a href='${resetPasswordUrl}'>Change Password</a>
        `
    });

    return res.json({ message: 'Link sent to Your Email' });
}

exports.verifyPasswordResetToken = (req, res) => {
    return res.json({ valid: true })
}

exports.resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;

    const user = await User.findById(userId);

    const isMatched = await User.comparePassword(newPassword);
    
    if(isMatched) {
        return sendError(res, 'New Password must be different from the old Password');
    }

    user.password = newPassword; // Password is Automatically Crypted by Modify Function in User Model
    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
    
    return res.json({ message: 'Password reset successful, now you can use your new password.' });
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        return sendError(res, 'Email/Password not Matched');
    }

    const matched = await user.comparePassword(password);

    if(!matched) {
        return sendError(res, 'Email/Password not Matched');
    }

    const { _id, name, role, isVerified } = user;

    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

    res.json({ user: { id: _id, name, email, role, token: jwtToken, isVerified } });

}

exports.isAuthVerification = (req, res) => {
    const { user } = req;
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
}