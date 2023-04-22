const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userOTPverificationSchema = new schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    trim: true,
  },
  secret: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

const userOTPverification = mongoose.model(
  "userOTPverification",
  userOTPverificationSchema
);
module.exports = userOTPverification;
