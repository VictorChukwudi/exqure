const mongoose = require("mongoose");
const schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *    schemas:
 *     cardDetails:
 *        type: object
 *        required:
 *          - card_number
 *          - cvv
 *          - expiry_date
 *          - card_holder_name
 *        properties:
 *          card_number:
 *               type: string
 *          cvv:
 *               type: string
 *          expiry_date:
 *               type: string
 *          card_holder_name:
 *               type: string
 *        example:
 *          card_number: "2245670919929493"
 *          cvv: "828"
 *          expiry_date: 03/25
 *          card_holder_name: John Doe
 */
const userCardDetailsSchema = new schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  card_number: {
    type: String,
    required: [true, "Card Number is required"],
    trim: true,
  },
  cvv: {
    type: String,
    required: [true, "CVV Security Number is required"],
    trim: true,
  },
  expiry_date: {
    type: String,
    required: [true, " Card Expiry Date is required"],
    trim: true,
  },
  card_holder_name: {
    type: String,
    required: [true, "Card Holder's name is required"],
  },
});

const userCardDetails = mongoose.model(
  "userCardDetails",
  userCardDetailsSchema
);
module.exports = userCardDetails;
