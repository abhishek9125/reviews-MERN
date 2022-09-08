const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");

exports.isValidPasswordResetToken = async (req, res, next) => {
    const { token, userId } = req.body;

    if(!token.trim() || !isValidObjectId(userId)) {
        return sendError(req, 'Invalid Token or UserId', 400);
    }

    const resetToken = await PasswordResetToken.findOne({ owner: userId });

    if(!resetToken) {
        return sendError(req, 'Unauthorized Access, Invalid Token');
    }

    const matched = await resetToken.compareToken(token);

    if(!matched) {
        return sendError(req, 'Unauthorized Access, Invalid Token');
    }

    req.resetToken = resetToken;

    next();
}