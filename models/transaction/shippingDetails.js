const mongoose = require("mongoose");
const schema = mongoose.Schema;

const shippingDetailsSchema = new schema({
  transaction_title: {
    type: String,
    ref: "transactionDetails",
  },
  transaction_id: {
    type: String,
    ref: "transactionDetails",
  },
  item_shipped: {
    type: String,
    ref: "transactionDetails",
  },
  shipping_method: {
    type: String,
  },
  transport_comp: {
    type: String,
    trim: true,
  },
  phone_no: {
    type: String,
    trim: true,
  },
  from: {
    type: String,
    trim: true,
  },
  destination: {
    type: String,
    trim: true,
  },
  days_4_delivery: {
    type: Number,
    trim: true,
  },
  date_sent: {
    type: String,
    trim: true,
  },
});

const shippingDetails = mongoose.model(
  "shippingDetails",
  shippingDetailsSchema
);
module.exports = shippingDetails;
