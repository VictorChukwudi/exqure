const { check } = require("express-validator");

module.exports = {
  blogUserSignupValidate: [
    check("fullname", "Fullname field is required")
      .exists()
      .bail()
      .notEmpty()
      .isLength({ min: 6 })
      .trim(),
    check("email", "Email is required (e.g johndoe@email.com) ")
      .exists()
      .bail()
      .notEmpty()
      .isEmail()
      .normalizeEmail(),
    check("password", "Password must be at least 6 characters long")
      .exists()
      .bail()
      .notEmpty()
      .isLength({ min: 6 })
      .matches(/\d/)
      .withMessage("Password must contain at least a digit"),
    check("confirmpassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  blogUserSigninValidate: [
    check("email", "Email is required")
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail(),
    check("password", "Password is required").exists().bail().not().isEmpty(),
  ],
  postValidate: [
    check("title", "Title needed")
      .exists()
      .bail()
      .notEmpty()
      .isLength({ max: 30 }),
    check("body", "Body is required").exists().bail().notEmpty(),
  ],
};
