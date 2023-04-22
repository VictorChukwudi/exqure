const Token = require("../models/user/token");
const bcrypt = require("bcryptjs");

const validateReset = async (req, res, next) => {
  try {
    const userID = req.params.userID;
    const resetToken = req.params.resetToken;
    if (!userID || !resetToken) {
      throw Error("Invalid link");
    } else {
      const passwordResetToken = await Token.findOne({ userId: userID });
      if (!passwordResetToken) {
        throw Error("Link has expired. Request again");
      } else {
        const verifyToken = await bcrypt.compare(
          resetToken,
          passwordResetToken.token
        );
        if (!verifyToken) {
          throw Error("Invalid link. Retry");
        } else {
          next();
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};

module.exports = {
  validateReset,
};
