const { check } = require("express-validator");

module.exports = {
  signupValidate: [
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
        throw new Error("Password does not match");
      }
      return true;
    }),
    check("phone", "Phone Number is required")
      .exists()
      .bail()
      .notEmpty()
      .isLength({ min: 8, max: 15 })
      .isString(),
  ],
  signinValidate: [
    check("email", "Email is required")
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail(),
    check("password", "Password is required").exists().bail().not().isEmpty(),
  ],
  paymentSettingValidate: [
    check("bvn", " A valid Bank Verification Number is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 9 }),
    check("bank_name", "Bank Name is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("account_number", " A valid Bank Account Number is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 9, max: 12 }),
    check("account_name", "Bank Account Name is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
  ],
  cardDetailValidate: [
    check("card_number", "Card Number is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric(),
    check("cvv", "A valid cvv number is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric()
      .isLength({ max: 3 }),
    check("expiry_date", "A valid date , MM/YY, is required")
      .exists()
      .bail()
      .isString()
      .matches(/^([0][1-9]|[1][0-2])\/\d{2}$/)
      .withMessage("Valid date in the form MM/YY"),
    check("card_holder_name", "Card Holder Name is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
  ],
  transactionValidate: [
    check("role", "Select transaction role. Buyer or Seller")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("transaction_title", "Transaction title is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("item_attribute", "Item attribute is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("item_category", "Item category is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("item_name", "Item name is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("item_price", "Item price is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric(),
    check("item_desc", "Item description is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("shipping_fee", "Shipping fee is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric(),
    check("shipping_method", "Shipping method is required")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("inspection_days", "Inspection days is required")
      .exists()
      .bail()
      .notEmpty()
      .isNumeric(),
  ],
  changePasswordValidate: [
    check("new_password", "Password must be at least 6 characters long")
      .exists()
      .bail()
      .notEmpty()
      .isLength({ min: 6 })
      .matches(/\d/)
      .withMessage("Password must contain at least a digit"),
    check("confirmpassword").custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Password does not match");
      }
      return true;
    }),
  ],
  shippingValidate: [
    check("transport_comp", "Add a transport company")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("phone_no", "Add a phone number")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("from", "Add location item is sent from.")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("destination", "Add item's retrieval location.")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("days_4_delivery", "Add days required for item delivery.")
      .exists()
      .bail()
      .notEmpty()
      .isString(),
    check("date_sent", "Enter date the item is sent.")
      .exists()
      .bail()
      .notEmpty()
      .isString()
      .matches(/^([0-2][0-9]|[3][0-1])\/([0][1-9]|[1][0-2])\/([2-9]\d{3})$/)
      .withMessage("Valid date in the form DD/MM/YYYY"),
  ],
};
