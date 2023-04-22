require("dotenv").config();
const { validationResult } = require("express-validator");
const User = require("../models/user/user");
const bcrypt = require("bcryptjs");
const userOTPverification = require("../models/user/userOTPverification");
const { sendOTPMail } = require("../util/Emails/sendOTP");
const jwt = require("jsonwebtoken");
const Token = require("../models/user/token");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const { sendEmail } = require("../util/Emails/sendEmail");
const Send2FASigninMail = require("../util/Emails/2FASigninEmail");

//Sign Up Controller
const signup = (req, res) => {
  const errors = validationResult(req);
  //Checks for signup credentials
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    const { fullname, email, password, phone } = req.body;
    //Check if user already exists
    User.findOne({ email })
      .then((user) => {
        if (user) {
          res.status(400).json({
            status: "Error",
            msg: "Email is already registered. Signin or signin with social signin.",
          });
        } else {
          //Creates new user if user does not exist
          const user = new User({
            fullname,
            email,
            password,
            phone,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) {
                res.status(500).json({
                  status: "Error",
                  msg: "Server Error",
                });
              }
              user.password = hash;

              user
                .save()
                .then((user) => {
                  //Sends OTP verification mail
                  sendOTPMail(user, res);
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    status: "Error",
                    msg: error.message,
                  });
                });
            });
          });
        }
      })
      .catch((error) => {
        if (error) {
          res.status(500).json({
            status: "Error",
            msg: error.message,
          });
        }
      });
  }
};

//Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { userID, otp } = req.body;
    //Checks for OTP details
    if (!userID || !otp) {
      res.status(400);
      throw Error("Empty OTP details are not allowed");
    } else {
      //Finds OTP record in database
      const userVerification = await userOTPverification.findOne({ userID });

      if (!userVerification) {
        res.status(400);
        throw new Error(
          "Account record does not exit or is verified already. Please log in or sign up"
        );
      } else {
        const { expiresAt, secret } = userVerification;

        //Checks if OTP has expired
        if (expiresAt < Date.now()) {
          userOTPverification.deleteMany({ userID });
          res.status(408);
          throw new Error("Code has expired. Please request again.");
        } else {
          //Verifies OTP
          const verified = await bcrypt.compare(otp, secret);

          if (!verified) {
            res.status(422);
            throw new Error("Invalid OTP. Check your inbox");
          } else {
            await User.updateOne({ _id: userID }, { verified: true });
            await userOTPverification.deleteOne({ userID });
            res.status(200).json({
              status: "Success",
              msg: "Your account has been verified",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

//Resend OTP using an async function
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    //Checks for Resend Details
    if (!email) {
      res.status(400);
      throw Error("Email is required");
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          status: "Error",
          msg: "Enter your signup email",
        });
      } else {
        await userOTPverification.deleteOne({ userID: user._id });
        //Resend OTP to Mail
        sendOTPMail({ _id: user._id, email }, res);
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

//SignIn Controller
const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    //Checks for signup credentials
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      //checking if user enabled 2FA
      if (user.two_FA_enabled) {
        const email = user.email;
        const username = user.fullname.split(" ")[1];
        const token = speakeasy.totp({
          secret: user.temp_secret.base32,
          encoding: "base32",
          step: 180, //3 minutes
        });
        Send2FASigninMail(token, { email, username }, res);
      } else {
        if (user && user.password) {
          if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { id: user._id, email },
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
                fullname: user.fullname,
                email: user.email,
                token,
              },
            });
          } else {
            res.status(400);
            throw Error("Invalid Credentials");
          }
        } else {
          res.status(400);
          throw Error(
            "Invalid Credentials. Signup or signin with social platforms."
          );
        }
      }
    }
  } catch (error) {
    // console.log(error);
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

//2FA Signin
const twoFASignin = async (req, res) => {
  try {
    const { email } = req.query;
    const { token } = req.body;
    //check for email on query parameters
    if (!email) {
      res.status(401);
      throw Error("Unauthorized. User not found.");
    } else {
      //Check body for token
      if (!token) {
        throw Error("OTP field cannot be empty");
      } else {
        //finding user in database
        const user = await User.findOne({ email });
        if (user) {
          const verify = speakeasy.totp.verify({
            secret: user.temp_secret.base32,
            encoding: "base32",
            token,
            step: 180, // 3 minutes
          });
          //Verifying OTP from body
          if (verify) {
            const token = jwt.sign(
              { id: user._id, email },
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
                fullname: user.fullname,
                email: user.email,
                token,
              },
            });
          } else {
            //when Token verification fails
            res.status(401);
            throw Error("Unauthorized. Malicious signin attempt.");
          }
        } else {
          //When user cannot be found in database
          res.status(401);
          throw Error("Unauthorized. User not found.");
        }
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

//Request reset password controller
const requestResetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      status: "Error",
      msg: "Email is required",
    });
  } else {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400);
        throw Error("User does not exist");
      } else {
        const token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne({ userId: user._id });
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);
        await new Token({
          userId: user._id,
          token: hash,
          createdAt: Date.now(),
        }).save();

        const userID = user._id;
        const link = `https://${req.get(
          "host"
        )}/api/user/resetPassword/${userID}/${resetToken}`;
        console.log(req.protocol);
        sendEmail(
          user.email,
          "Password Reset Request",
          { name: user.fullname.split(" ")[0], link: link },
          "../template/requestResetPassword.handlebars",
          res
        ).then(() => {
          res.status(200).json({
            status: "Success",
            msg: "Reset password with link sent to your mail box.",
          });
        });
      }
    } catch (error) {
      res.json({
        status: "Error",
        msg: error.message,
      });
    }
  }
};

//Password Reset controller
const resetPassword = async (req, res) => {
  try {
    const { userID } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword) {
      res.status(400);
      throw Error("Fields should not be empty");
    } else {
      if (password !== confirmpassword) {
        res.status(400);
        throw Error("Passwords do not match");
      } else {
        const user = await User.findById(userID);
        if (await bcrypt.compare(password, user.password)) {
          res.status(400);
          throw Error("A new password is required");
        } else {
          const newPassword = await bcrypt.hash(password, 10);
          const user = await User.findByIdAndUpdate(userID, {
            $set: { password: newPassword },
          });

          sendEmail(
            user.email,
            "Password Reset Successfully",
            {
              name: user.fullname.split(" ")[0],
            },
            "../template/resetPassword.handlebars"
          );

          await Token.deleteOne({ userId: userID });
          res.status(200).json({
            status: "Success",
            msg: "Password Successfully Reset.You can login now",
          });
        }
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(["-__v", "-password"]);
    if (!users) {
      res.status(200).json({
        status: "Error",
        msg: "There are no users currently",
      });
    } else {
      res.status(200).json({
        status: "Success",
        users,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

module.exports = {
  signup,
  signIn,
  twoFASignin,
  verifyOTP,
  resendOTP,
  requestResetPassword,
  resetPassword,
  getUsers,
};
