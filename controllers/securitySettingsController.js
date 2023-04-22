require("dotenv").config();
const speakeasy = require("speakeasy");
const { validationResult } = require("express-validator");
const User = require("../models/user/user");
const Send2FAMail = require("../util/Emails/2FAEnableEmail");

const enable2FAViaEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const email = user.email;
    const username = user.fullname.split(" ")[1];
    const timeInMiliSeconds = Date.now() + 300000;
    const token = speakeasy.totp({
      secret: user.temp_secret.base32,
      encoding: "base32",
      step: 300, //5 minutes
    });
    Send2FAMail(token, { email, username }, res);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "Error",
      message: "Server Error",
    });
  }
};

const verify2FAtoken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { token } = req.body;
    if (!token) {
      res.status(400);
      throw Error("Field cannot be empty");
    } else {
      const verify = speakeasy.totp.verify({
        secret: user.temp_secret.base32,
        encoding: "base32",
        token,
        // window: 1,
        step: 300, // 5 minutes
      });

      if (!verify) {
        res.status(400);
        throw Error("The token is invalid or has expired.");
      } else {
        await User.updateOne(
          { _id: req.user.id },
          { $rename: { temp_secret: "secret" } }
        );
        await User.updateOne(
          { _id: req.user.id },
          { $set: { two_FA_enabled: true } }
        );
        res.status(200).json({
          status: "Success",
          msg: "Two-Factor Verification enabled successfully.",
        });
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};
module.exports = {
  enable2FAViaEmail,
  verify2FAtoken,
};
