require("dotenv").config();
const { parse, stringify, toJSON } = require("flatted");
const { validationResult } = require("express-validator");
const TransactionDetails = require("../models/transaction/transactionDetails");
const User = require("../models/user/user");
const TransactionRegister = require("../models/transaction/transactionRegister");
const Tracker = require("../models/transaction/transactionTracker");
const ShippingDetails = require("../models/transaction/shippingDetails");
const {
  transPrefix,
  total,
  fileUpload,
  countDown,
} = require("../util/functions");
const { transactionMail } = require("../util/Emails/TransactionEmail");
// const upload = require("../util/multer");
const prefix = process.env.TRANSACTION_PREFIX;

const createTransaction = async (req, res) => {
  try {
    const images = req.files;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      if (!images || images.length !== 3) {
        throw Error("3 Item images are required");
      } else {
        const createdBy = req.user.email;
        const {
          role,
          transaction_title,
          item_attribute,
          item_category,
          item_name,
          item_price,
          item_desc,
          shipping_fee,
          shipping_method,
          inspection_days,
        } = req.body;

        const commission = 0.01 * Number(item_price);
        const imagesUploader = await fileUpload(images);
        const transaction = await new TransactionDetails({
          createdBy,
          role,
          transaction_title,
          item_attribute,
          item_category,
          item_name,
          item_price,
          item_desc,
          item_images: imagesUploader,
          shipping_fee,
          shipping_method,
          inspection_days,
          commission,
          total: total(item_price, shipping_fee),
        }).save();

        //creating transaction_id
        const transaction_id = `${prefix}${transPrefix(
          transaction.item_category
        )}${transaction._id.toString()}`;
        //Updating trasnsaction id
        const myTransaction = await TransactionDetails.findByIdAndUpdate(
          { _id: transaction._id },
          {
            $set: {
              transaction_id: transaction_id,
              invite_link: `${req.protocol}://${req.get(
                "host"
              )}/api/transaction/view/${transaction_id}`,
            },
          },
          { new: true }
        );

        //Adding Transaction Trackers
        const creator = await User.findOne({ email: req.user.email });
        await new Tracker({
          transaction_title: transaction.transaction_title,
          transaction_id: transaction_id,
          createdBy: {
            name: creator.fullname,
            email: creator.email,
            phone: creator.phone,
            role: transaction.role,
          },
          recipient: {
            name: null,
            email: null,
            phone: null,
            role: transaction.role === "buyer" ? "seller" : "buyer",
          },
        }).save();

        //Filling details of the transaction register
        if (transaction.role === "buyer") {
          await new TransactionRegister({
            transaction_id: transaction_id,
            buyer: req.user.email,
          }).save();
        } else {
          await new TransactionRegister({
            transaction_id: transaction_id,
            seller: req.user.email,
          }).save();
        }

        res.status(201).json({
          status: "Success",
          msg: "Transaction Created",
          data: await TransactionDetails.findOne({ transaction_id }).select([
            "-_id",
            "-__v",
            "-createdBy",
          ]),
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: error.message || "Check Internet Connectivity",
    });
  }
};
const sendInviteTransactionMsg = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        status: "Error",
        msg: "Recipient's email address is required",
      });
    } else {
      const transaction_id = req.params.transaction_id;
      const user = await User.findById({ _id: req.user.id });
      const transaction = await TransactionDetails.findOne({
        transaction_id,
      });

      if (!transaction) {
        res.status(400);
        throw Error("Transaction does not exist");
      } else {
        transactionMail(user.fullname, email, transaction.invite_link, res);
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactionsCreated = await TransactionDetails.find({
      createdBy: req.user.email,
    });
    const transactionsReceived = await TransactionDetails.find({
      recipient: req.user.email,
    });
    if (transactionsCreated.length < 1 && transactionsReceived.length < 1) {
      res.status(200).json({
        status: "Success",
        msg: "There are no tranasctions currently",
      });
    } else {
      res.status(200).json({
        status: "Success",
        transactions: [...transactionsCreated, ...transactionsReceived],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const viewTransactionInvite = async (req, res) => {
  try {
    const transaction_id = req.params.transaction_id;
    const transaction = await TransactionDetails.findOne({
      transaction_id,
    }).select(["-__v", "-_id", "-userID", "-role", "-invite_link"]);
    if (!transaction) {
      res.status(400);
      throw Error("Transaction does not exist");
    } else {
      res.status(200).json({
        status: "Success",
        transaction,
      });
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

const acceptContract = async (req, res) => {
  try {
    const transaction_id = req.params.transaction_id;
    const transaction = await TransactionDetails.findOne({ transaction_id });
    if (!transaction) {
      res.status(400);
      throw Error("Transaction does not exist");
    } else {
      //check transaction register to update to invite party, either the buyer or seller is updated
      const checkRegister = await TransactionRegister.findOne({
        transaction_id,
      });
      if (checkRegister.buyer) {
        await TransactionRegister.findOneAndUpdate(
          { transaction_id },
          { $set: { seller: req.user.email } }
        );
      } else {
        await TransactionRegister.findOneAndUpdate(
          { transaction_id },
          { $set: { buyer: req.user.email } }
        );
      }

      await TransactionDetails.findOneAndUpdate(
        { transaction_id },
        { $set: { transaction_status: "accepted", recipient: req.user.email } }
      );
      //updating Transaction tracker
      const receiver = await User.findOne({ email: req.user.email });

      await Tracker.findOneAndUpdate(
        { transaction_id },
        {
          $set: {
            terms_and_conditions: "Accepted",
            transaction_status: "Ongoing",
            "recipient.name": receiver.fullname,
            "recipient.email": receiver.email,
            "recipient.phone": receiver.phone,
          },
        }
      );

      //Acceptance output
      res.status(200).json({
        status: "Success",
        msg: "You have accepted the transaction contract",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};
const declineContract = async (req, res) => {
  try {
    const transaction_id = req.params.transaction_id;
    const transaction = await TransactionDetails.findOne({ transaction_id });

    if (!transaction) {
      res.status(400);
      throw Error("Transaction does not exist");
    } else {
      await TransactionDetails.findOneAndUpdate(
        { transaction_id },
        { $set: { transaction_status: "declined", recipient: req.user.email } }
      );
      //updating Transaction tracker
      await Tracker.findOneAndUpdate(
        { transaction_id },
        {
          $set: {
            terms_and_conditions: "Declined",
            transaction_status: "Declined",
            "recipient.name": receiver.fullname,
            "recipient.email": receiver.email,
            "recipient.phone": receiver.phone,
          },
        }
      );
      //check transaction register to update to invite party, either the buyer or seller is updated
      const checkRegister = await TransactionRegister.findOne({
        transaction_id,
      });
      if (checkRegister.buyer) {
        await TransactionRegister.findOneAndUpdate(
          { transaction_id },
          { $set: { seller: req.user.email } }
        );
      } else {
        await TransactionRegister.findOneAndUpdate(
          { transaction_id },
          { $set: { buyer: req.user.email } }
        );
      }
      res.status(200).json({
        status: "Success",
        msg: "You have declined the transaction contract",
      });
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

const getTrackedTransactions = async (req, res) => {
  try {
    const tracked = await Tracker.find({
      $or: [
        { "createdBy.email": req.user.email },
        { "recipient.email": req.user.email },
      ],
    });

    const allTransactions = tracked.map((item) => {
      let role;
      let trading_party;
      if (item.createdBy.email === req.user.email) {
        role = item.createdBy.role;
        trading_party = {
          name: item.recipient.name,
          email: item.recipient.email,
          phone: item.recipient.phone,
          role: item.recipient.role,
        };
      } else if (item.recipient.email === req.user.email) {
        role = item.recipient.role;
        trading_party = {
          name: item.createdBy.name,
          email: item.createdBy.email,
          phone: item.createdBy.phone,
          role: item.createdBy.role,
        };
      }
      return {
        transaction_title: item.transaction_title,
        transaction_id: item.transaction_id,
        role: role,
        status: item.transaction_status,
        terms_and_conditions: item.terms_and_conditions,
        buyer_payment: item.buyer_payment,
        item_shipment: item.item_shipment,
        delivery_confirmation: item.delivery_confirmation,
        inspection: item.inspection,
        cash_disbursement: item.cash_disbursing,
        trading_party: trading_party,
      };
    });

    if (tracked.length < 1) {
      res.status(200).json({
        status: "Success",
        msg: "There are no tracked transactions currently",
      });
    } else {
      res.status(200).json({
        status: "Success",
        transactions: [...allTransactions],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const addShippingDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { transaction_id } = req.params;
      if (!transaction_id) {
        throw Error("Could not find transaction");
      } else {
        const {
          transport_comp,
          phone_no,
          from,
          destination,
          days_4_delivery,
          date_sent,
        } = req.body;
        const transactionDetails = await TransactionDetails.findOne({
          transaction_id,
        });
        const findShippedAlready = await ShippingDetails.findOne({
          transaction_id,
        });
        if (findShippedAlready) {
          throw Error("Item has been shipped already");
        } else {
          const shipping = new ShippingDetails({
            transaction_title: transactionDetails.transaction_title,
            transaction_id,
            item_shipped: transactionDetails.item_name,
            shipping_method: transactionDetails.shipping_method,
            transport_comp,
            phone_no,
            from,
            destination,
            days_4_delivery,
            date_sent,
          });
          await shipping.save();
          //Updating Transaction Tracker
          await Tracker.findOneAndUpdate(
            { transaction_id },
            {
              $set: { item_shipment: "Done", delivery_confirmation: "Pending" },
            }
          );
          res.status(201).json({
            status: "Success",
            data: await ShippingDetails.findOne({ transaction_id }).select([
              "-__v",
              "-_id",
            ]),
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const confirmYesDelivery = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    if (!transaction_id) {
      res.status(400);
      throw Error("Transaction cannot be found");
    } else {
      const inspect = await TransactionDetails.findOne({ transaction_id });
      await Tracker.findOneAndUpdate(
        { transaction_id },
        { $set: { delivery_confirmation: "Done" } }
      );
      countDown(transaction_id);
      res.status(200).json({
        status: "Success",
        msg: "Goods delivery successfully confirmed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};
const confirmNoDelivery = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    if (!transaction_id) {
      res.status(400);
      throw Error("Transaction cannot be found");
    } else {
      await Tracker.findOneAndUpdate(
        { transaction_id },
        { $set: { delivery_confirmation: "Not Delivered" } }
      );

      res.status(200).json({
        status: "Success",
        msg: "Goods not delivered confirmed.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};
module.exports = {
  createTransaction,
  sendInviteTransactionMsg,
  viewTransactionInvite,
  acceptContract,
  declineContract,
  getTransactions,
  getTrackedTransactions,
  addShippingDetails,
  confirmYesDelivery,
  confirmNoDelivery,
};
