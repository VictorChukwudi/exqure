const mongoose = require("mongoose");
const schema = mongoose.Schema;

const transactionRegisterSchema = new schema({
  transaction_id: {
    type: String,
    required: true,
    trim: true,
  },
  buyer: {
    type: String,
    trim: true,
  },
  seller: {
    type: String,
    trim: true,
  },
});

const TransactionRegister = mongoose.model(
  "TransactionRegister",
  transactionRegisterSchema
);
module.exports = TransactionRegister;
