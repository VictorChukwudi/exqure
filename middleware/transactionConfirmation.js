const BuyerTracker = require("../models/transaction/buyerTransactionTracker");
const SellerTracker = require("../models/transaction/sellerTransactionTracker");
const TransactionRegister = require("../models/transaction/transactionRegister");

const confirmPayment = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;
    const buyer = await BuyerTracker.findOne({ transaction_id });
    const seller = await SellerTracker.findOne({ transaction_id });
    if (buyer.buyer_payment === "Done" && seller.buyer_payment === "Done") {
      next();
    } else {
      throw Error("Buyer needs to make payment before Seller ships the item.");
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const checkForBuyer = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;
    const findBuyer = await TransactionRegister.findOne({ transaction_id });

    if (findBuyer.buyer === req.user.email) {
      next();
    } else {
      res.status(403);
      throw Error("Buyers only can confirm for the items delivered.");
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

const checkIfDelivered = async (req, res, next) => {
  const { transaction_id } = req.params;
  const checkIfDelivered = await BuyerTracker.findOne({ transaction_id });

  if (
    checkIfDelivered.delivery_confirmation === null ||
    checkIfDelivered.delivery_confirmation === "Pending"
  ) {
    next();
  } else {
    res.status(403).json({
      status: "Error",
      msg: "Item(s) delivery has already been confirmed.",
    });
  }
};
module.exports = {
  confirmPayment,
  checkForBuyer,
  checkIfDelivered,
};
