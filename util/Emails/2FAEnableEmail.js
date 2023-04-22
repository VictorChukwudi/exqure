require("dotenv").config();
const transporter = require("../../config/nodemailer");
const User = require("../../models/user/user");
const express = require("express");
const Send2FAMail = (token, { email, username }, res) => {
  const mailOptions = {
    from: process.env.STARTUP_EMAIL,
    to: email,
    subject: "Two-Factor Verification",
    html: `Hi ${username}, this is your two-factor verification token <b>${token}</b>. It expires in <b>5</b> minutes.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).json({
        status: "Error",
        msg: "Check network connectivity.",
      });
    } else {
      res.status(200).json({
        status: "Success",
        msg: "Two-Factor token has been sent to your email.",
      });
    }
  });
};

module.exports = Send2FAMail;
