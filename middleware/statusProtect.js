const Transaction = require("../models/transaction/transactionDetails");
const { checkTransactionStatus } = require("../util/functions");
const canAccessTransaction = async (req, res, next) => {
  const { transaction_id } = req.params;
  const transaction = await Transaction.findOne({ transaction_id });
  if (req.user.email === transaction.createdBy) {
    res.status(403).json({
      status: "Unauthorized",
      msg: `Transaction status : ${checkTransactionStatus(
        transaction.transaction_status
      ).toUpperCase()}`,
    });
  } else {
    next();
  }
};

const acceptOrDecline = async (req, res, next) => {
  const { transaction_id } = req.params;
  const transaction = await Transaction.findOne({ transaction_id });
  if (
    transaction.transaction_status === "accepted" ||
    transaction.transaction_status === "declined"
  ) {
    res.status(400).json({
      status: "Error",
      msg: `This transaction contract has been ${transaction.transaction_status} already`,
    });
  } else {
    next();
  }
};
module.exports = {
  canAccessTransaction,
  acceptOrDecline,
};
