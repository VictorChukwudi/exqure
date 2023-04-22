require("dotenv").config();
const transporter = require("../../config/nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userOTPverification = require("../../models/user/userOTPverification");
const User = require("../../models/user/user");

const sendOTPMail = async ({ _id, email, fullname }, res) => {
  const otp = (100000 + Math.floor(Math.random() * 900000)).toString();

  const salt = await bcrypt.genSalt(10);
  const secret = await bcrypt.hash(otp, salt);

  const mailOptions = {
    from: process.env.STARTUP_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p> Enter this OTP <b> ${otp} </b> to verify your email and complete your registration. This OTP expires in 30 minutes</p>`,
  };

  const newOTPverification = new userOTPverification({
    userID: _id,
    secret,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1800000,
  });

  newOTPverification
    .save()
    .then(() => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: "Error",
            msg: " Error occured when sending OTP",
            data: {
              userID: _id,
              fullname: fullname,
              email: email,
            },
          });
        } else {
          res.status(200).json({
            status: "Success",
            msg: "Verification OTP sent. Verify your account.",
            data: {
              userID: _id,
              fullname: fullname,
              email: email,
            },
          });
        }
      });
    })
    .catch((err) => {
      res.json({
        status: "Error",
        msg: err.message,
        data: {
          userID: _id,
          fullname: fullname,
          email: email,
        },
      });
    });
};

module.exports = {
  sendOTPMail,
};
