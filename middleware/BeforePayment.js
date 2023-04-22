const Transaction = require("../models/transaction/transactionDetails");

const acceptedBeforePayment = async (req, res, next) => {
  const transaction_id = req.params.transaction_id;
  const transaction = await Transaction.findOne({ transaction_id });
  if (transaction.transaction_status === "accepted") {
    next();
  } else {
    res.status(400).json({
      status: "Error",
      msg: "This transaction contract is/has not been accepted",
    });
  }
};

module.exports = {
  acceptedBeforePayment,
};
