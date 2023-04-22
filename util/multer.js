const multer = require("multer");
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    // let ext = path.extname(file.originalname);
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
});
