const multer = require("multer");
const upload = require("../util/multer").array("images");

const checkUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        msg: err.message,
      });
    } else {
      next();
    }
  });
};
module.exports = checkUpload;
