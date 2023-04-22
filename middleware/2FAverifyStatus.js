// const User = require("../models/user");
const User = require("../models/user/user");

const twoFA_Enabled = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.two_FA_enabled) {
    res.status(200).json({
      status: "Success",
      msg: "Two-factor authentication enabled already",
    });
  } else {
    next();
  }
};

module.exports = twoFA_Enabled;
