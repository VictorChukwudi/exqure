const speakeasy = require("speakeasy");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     signup:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *         - confirmpassword
 *         - phone
 *       properties:
 *         fullname:
 *                 type: string
 *         email:
 *                 type: string
 *         password:
 *                 type: string
 *         confirmpassword:
 *                 type: string
 *         phone:
 *                 type: string
 *       example:
 *         fullname: John Doe
 *         email: johndoe@example.com
 *         password: strongpassword123
 *         confirmpassword: strongpassword123
 *         phone: "08031330821"
 * */

/**
 * @swagger
 * components:
 *    schemas:
 *      verifyOTP:
 *        type: object
 *        required:
 *          - userID
 *          - otp
 *        properties:
 *          userID:
 *                type: objectId
 *          otp:
 *                type: integer
 *        example:
 *          userID: 62c30802136455d8086acabc
 *          otp: "675432"
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      resendOTP:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *                type: string
 *        example:
 *          email: johndoe@example.com
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      signin:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *                type: string
 *          password:
 *                type: string
 *        example:
 *          email: johndoe@example.com
 *          password: strongpassword123
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      twoFASignin:
 *        type: object
 *        required:
 *          - token
 *        properties:
 *          token:
 *                type: string
 *        example:
 *          token: "123456"
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      verify2FA:
 *        type: object
 *        required:
 *          - token
 *        properties:
 *          token:
 *                type: string
 *        example:
 *          token: "123456"
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      requestResetPassword:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *                type: string
 *        example:
 *          email: johndoe@example.com
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      resetPassword:
 *        type: object
 *        required:
 *          - password
 *          - confirmpassword
 *        properties:
 *          passwrord:
 *                type: string
 *          confirmpasswrord:
 *                type: string
 *        example:
 *          password: aNewStrongPassword123
 *          confirmpassword: aNewStrongPassword123
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     personalDetails:
 *       type: object
 *       required:
 *         - account_type
 *         - fullname
 *         - phone
 *         - alt_phone
 *         - country
 *         - dob
 *         - billing_address
 *         - city
 *         - state
 *         - zipOrPostCode
 *       properties:
 *         account_type:
 *                 type: string
 *         fullname:
 *                 type: string
 *         phone:
 *                 type: string
 *         alt_phone:
 *                 type: string
 *         country:
 *                 type: string
 *         dob:
 *                 type: date
 *         billing_address:
 *                 type: string
 *         city:
 *                 type: string
 *         state:
 *                 type: string
 *         zipOrPostCode:
 *                 type: integer
 *       example:
 *         account_type: individual
 *         fullname: John Doe
 *         phone: "08097555784"
 *         alt_phone: "090766432346"
 *         country: Nigeria
 *         dob: 7/14/2022
 *         billing_address: your billing address
 *         city: your city
 *         state: your state
 *         zipOrPostCode: "450264"
 * */
/**
 * @swagger
 * components:
 *   schemas:
 *     companyDetails:
 *       type: object
 *       required:
 *         - account_type
 *         - fullname
 *         - company_name
 *         - company_email
 *         - phone
 *         - alt_phone
 *         - country
 *         - dob
 *         - billing_address
 *         - city
 *         - state
 *         - zipOrPostCode
 *       properties:
 *         account_type:
 *                 type: string
 *         fullname:
 *                 type: string
 *         company_name:
 *                 type: string
 *         company_email:
 *                 type: string
 *         phone:
 *                 type: string
 *         alt_phone:
 *                 type: string
 *         country:
 *                 type: string
 *         dob:
 *                 type: date
 *         billing_address:
 *                 type: string
 *         city:
 *                 type: string
 *         state:
 *                 type: string
 *         zipOrPostCode:
 *                 type: integer
 *       example:
 *         account_type: individual
 *         fullname: John Doe
 *         company_name: John Company
 *         company_email: company@example.com
 *         phone: "08097555784"
 *         alt_phone: "090766432346"
 *         country: Nigeria
 *         dob: 7/14/2022
 *         billing_address: your billing address
 *         city: your city
 *         state: your state
 *         zipOrPostCode: "450264"
 * */

/**
 * @swagger
 * components:
 *    schemas:
 *      changePassword:
 *        type: object
 *        required:
 *          - new_password
 *          - confirmpassword
 *        properties:
 *          new_password:
 *                type: string
 *          confirmpassword:
 *                type: string
 *        example:
 *          new-password: astrongNewPassword2
 *          confirmpassword: astrongNewPassword2
 */

const userSchema = new schema({
  fullname: {
    type: String,
    required: [true, "Fullname field is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    // required: [true, "A valid email is required"],
    trim: true,
  },
  password: {
    type: String,
    // required: [true, "A strong password is required"],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },

  //SOCIAL SIGN-IN IDs
  google_ID: {
    type: String,
    sparse: true,
  },
  facebook_ID: {
    type: String,
    sparse: true,
  },
  //TWO-FACTOR AUTHENTICATION SECRET
  temp_secret: {
    type: Object,
    required: true,
    trim: true,
    default: speakeasy.generateSecret(),
  },
  two_FA_enabled: {
    type: Boolean,
    default: false,
  },

  // USER PERSONAL/ACCOUNT DETAILS
  //Details if account type is for individual
  account_type: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ["none", "individual", "company"],
    default: "none",
  },
  alt_phone: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
    trim: true,
  },
  billing_address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  zipOrPostCode: {
    type: String,
    trim: true,
  },

  //Additional Details if account type is for company
  company_name: {
    type: String,
    trim: true,
  },
  company_email: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
