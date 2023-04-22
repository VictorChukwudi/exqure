const mongoose = require("mongoose");
const schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *    schemas:
 *      paymentDetails:
 *        type: object
 *        required:
 *          - bvn
 *          - bank_name
 *          - account_number
 *          - account_name
 *        properties:
 *          bvn:
 *               type: string
 *          bank_name:
 *               type: string
 *          account_number:
 *               type: integer
 *          account_name:
 *               type: string
 *        example:
 *          bvn: "09190929493"
 *          bank_name: Access Bank
 *          account_number: "087654345678"
 *          account_name: John Doe
 */

const userPaymentSettingSchema = new schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  bvn: {
    type: String,
    required: [true, "Bank Verification Number is required"],
    trim: true,
  },
  bank_name: {
    type: String,
    required: [true, "Bank Name is required"],
    trim: true,
    // lowercase: true,
  },
  account_number: {
    type: String,
    required: [true, " Bank Account Number is required"],
    trim: true,
  },
  account_name: {
    type: String,
    required: [true, "Bank Account Name is required"],
    trim: true,
  },
});

const userPaymentSetting = mongoose.model(
  "userPaymentSetting",
  userPaymentSettingSchema
);
module.exports = userPaymentSetting;
