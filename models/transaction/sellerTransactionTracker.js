const mongoose = require("mongoose");
const schema = mongoose.Schema;

const SellerTrackerSchema = new schema({
  transaction_title: {
    type: String,
    trim: true,
  },
  transaction_id: {
    type: String,
    trim: true,
    unique: true,
  },
  transaction_status: {
    type: String,
    trim: true,
    default: "Pending",
  },
  terms_and_conditions: {
    type: String,
    trim: true,
    enum: ["Accepted", "Declined", "Pending"],
    default: "Pending",
  },
  buyer_payment: {
    type: String,
    trim: true,
    default: null,
  },
  item_shipment: {
    type: String,
    trim: true,
    default: null,
  },
  delivery_confirmation: {
    type: String,
    trim: true,
    default: null,
  },

  inspection: {
    type: Object,
    default: null,
  },
  cash_disbursing: {
    type: String,
    trim: true,
    default: null,
  },
  createdBy: {
    type: Object,
  },
  recipient: {
    type: Object,
  },
});

const SellerTracker = mongoose.model("SellerTracker", SellerTrackerSchema);
module.exports = SellerTracker;
