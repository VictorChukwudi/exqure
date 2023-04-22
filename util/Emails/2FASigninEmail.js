require("dotenv").config();
const transporter = require("../../config/nodemailer");
const User = require("../../models/user/user");
const Send2FASigninMail = (token, { email, username }, res) => {
  const mailOptions = {
    from: process.env.STARTUP_EMAIL,
    to: email,
    subject: "Signin Attempt",
    html: `Hi ${username}, this is your two-factor signin OTP <b>${token}</b>. It expires in <b>3</b> minutes.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).json({
        status: "Error",
        msg: "Check network connectivity.",
      });
    } else {
      res.json({
        status: "Success",
        msg: "Enter 2FA OTP sent to your email to sign in",
        email: email,
      });
    }
  });
};

module.exports = Send2FASigninMail;
