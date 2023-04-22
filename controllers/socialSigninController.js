require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user/user");
const passport = require("passport");

const googleSigninRedirect = async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findOne({ email: req.user.email });
    const token = jwt.sign(
      { email: req.user.email, id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      status: "Success",
      msg: "Logged In",
      data: {
        userId: user._id,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};
const facebookSigninRedirect = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findOne({ email: req.user.email });
    const token = jwt.sign({ user: req.user }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    res.status(200).json({
      status: "Success",
      msg: "Logged In",
      data: {
        userId: user._id,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};
module.exports = {
  googleSigninRedirect,
  facebookSigninRedirect,
};
