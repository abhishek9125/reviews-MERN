const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, verifyPasswordResetToken, signIn, resetPassword, isAuthVerification } = require('../controllers/user');
const { isAuth } = require('../middlewares/auth');
const { isValidPasswordResetToken } = require('../middlewares/user');
const { userValidator, validate, validatePassword, signInValidator } = require('../middlewares/validator');

const router = express.Router();

router.get('/is-auth', isAuth, isAuthVerification);
router.post('/create', userValidator, validate, create);
router.post('/sign-in', signInValidator, validate, signIn);
router.post('/verify-email', verifyEmail);
router.post('/resend-email-verification-token', resendEmailVerificationToken);
router.post('/forget-password', forgetPassword);
router.post('/verify-password-reset-token', isValidPasswordResetToken, verifyPasswordResetToken);
router.post('/reset-password', validatePassword, validate, isValidPasswordResetToken, resetPassword);

module.exports = router;