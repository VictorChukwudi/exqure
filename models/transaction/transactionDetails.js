const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *    schemas:
 *      createTransaction:
 *        type: object
 *        required:
 *          - role
 *          - transaction_title
 *          - item_attribute
 *          - item_category
 *          - item_name
 *          - item_price
 *          - item_desc
 *          - images
 *          - shipping_method,
 *          - shipping_fee,
 *          - inspection_days,
 *        properties:
 *          role:
 *               type: string
 *          transaction_title:
 *               type: string
 *          item_attribute:
 *               type: string
 *          item_category:
 *               type: string
 *          item_name:
 *               type: string
 *          item_price:
 *               type: double
 *          item_desc:
 *               type: string
 *          images:
 *               type: array
 *               description: Upload 3 item images
 *               images:
 *                 type: string
 *                 format: binary
 *               encoding:
 *                images:
 *                 contentType: image/png, image/jpeg
 *          shipping_method:
 *               type: string
 *          shipping_fee:
 *               type: double
 *          inspection_days:
 *               type: integer
 *        example:
 *          role: buyer
 *          transaction_title: your transaction title
 *          item_attribute: transaction item attribute
 *          item_category: transaction item category
 *          item_name: transaction item name
 *          item_price: transaction item price
 *          item_desc: transaction item description
 *          images: image
 *          shipping_method: shipping method to be used
 *          shipping_fee: shipping fee
 *          inspection_days: item inspection days
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      inviteMsg:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *        example:
 *          email: sarahquincy@example.com
 */

const transactionDetailsSchema = new Schema({
  createdBy: {
    type: String,
    required: true,
    ref: "User",
    trim: true,
  },
  recipient: {
    type: String,
    trim: true,
  },
  transaction_id: {
    type: String,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["buyer", "seller"],
    trim: true,
  },
  transaction_title: {
    type: String,
    required: true,
    trim: true,
  },
  item_attribute: {
    type: String,
    required: true,
    trim: true,
  },
  item_category: {
    type: String,
    // enum: [
    //   "furniture",
    //   "cryptocurrency",
    //   "clothing & accessories",
    //   "electronics & gadgets",
    //   "others",
    // ],
    default: "others",
    lowercase: true,
    required: true,
    trim: true,
  },
  item_name: {
    type: String,
    required: true,
    trim: true,
  },
  item_price: {
    type: Number,
    required: true,
    trim: true,
  },
  item_desc: {
    type: String,
    require: true,
    trim: true,
  },
  item_images: {
    type: Array,
  },
  shipping_fee: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },
  shipping_method: {
    type: String,
    trim: true,
  },
  inspection_days: {
    type: Number,
    required: true,
    trim: true,
  },
  commission: {
    type: Number,
    trim: true,
  },
  total: {
    type: Number,
    trim: true,
  },
  invite_link: {
    type: String,
    trim: true,
  },
  transaction_status: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ["pending", "accepted", "declined", "ongoing", "done"],
    default: "pending",
  },
});
const transactionDetails = mongoose.model(
  "transactionDetails",
  transactionDetailsSchema
);
module.exports = transactionDetails;
