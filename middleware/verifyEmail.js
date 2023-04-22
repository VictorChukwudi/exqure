const User = require("../models/user/user");

const verifyEmail = async (req, res, next) => {
  const checkVerified = await User.findById(req.user.id);
  if (checkVerified.verified !== true) {
    res.status(403).json({
      status: "Forbidden",
      msg: "Verify your email with the verification code sent or click resend to resend verification OTP",
    });
  } else {
    next();
  }
};

module.exports = verifyEmail;
