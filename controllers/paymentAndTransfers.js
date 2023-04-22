require("dotenv").config();
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const User = require("../models/user/user");
const Transaction = require("../models/transaction/transactionDetails");
const SellerTracker = require("../models/transaction/sellerTransactionTracker");
const BuyerTracker = require("../models/transaction/buyerTransactionTracker");
const Bank = require("../models/user/userPaymentSettings");
const { getBanks } = require("../util/functions");

const payWithFlutter = async (req, res) => {
  const got = require("got");
  try {
    //this transaction id is exqure's transaction id
    const transaction_id = req.params.transaction_id;
    const user = await User.findById(req.user.id);
    const transaction = await Transaction.findOne({ transaction_id });
    const response = await got.post("https://api.flutterwave.com/v3/payments", {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
      json: true,
      json: {
        // tx_ref:  "hooli-tx-1920bbtytty",
        tx_ref: transaction.transaction_id,
        amount: transaction.total,
        currency: "NGN",
        redirect_url:
          "http://localhost:5000/api/payments/verifyPayment" ||
          "https://exqure.herokuapp.com/api/payments/verifyPayment",
        // "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
        meta: {
          consumer_id: user._id.toString(),
          //   consumer_mac: "92a3-912ba-1192a", user._id.toString()
        },
        customer: {
          //Test cases
          // email: "victorukay@gmail.com",
          // phonenumber: "08031330821",
          // name: "Ukoha Victor",
          email: user.email,
          phonenumber: user.phone,
          name: user.fullname,
        },
        customizations: {
          title: transaction.transaction_title || "Pied Piper Payments",
          //   logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
        },
      },
    });
    const body = JSON.parse(response.body);
    res.status(301).redirect(body.data.link);
  } catch (error) {
    console.log(error);
    // console.log(error.code);
    // console.log(error.response);
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const verifyFlutterPayment = async (req, res) => {
  try {
    if (req.query.status === "successful") {
      const transaction = await Transaction.findOne({
        transaction_id: req.query.tx_ref,
      });
      // the transaction id here is flutterwave transaction id
      const response = await flw.Transaction.verify({
        id: req.query.transaction_id,
      });

      if (
        response.data.status === "successful" &&
        response.data.amount === transaction.total &&
        response.data.currency === "NGN"
      ) {
        // Success! Confirm the customer's payment
        await BuyerTracker.findOneAndUpdate(
          { transaction_id: req.query.tx_ref },
          { $set: { buyer_payment: "Done", item_shipment: "Pending" } }
        );
        await SellerTracker.findOneAndUpdate(
          { transaction_id: req.query.tx_ref },
          { $set: { buyer_payment: "Done", item_shipment: "Pending" } }
        );
        res.status(200).json({
          status: "Success",
          msg: "Your payment was successful.",
        });
      } else {
        // Inform the customer their payment was unsuccessful
        res.status(400);
        throw Error("Your payment was unsuccessful. Try again.");
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};
// const listBanks = async (req, res) => {
//   const got = require("got");
//   try {
//     const response = await got("https://api.flutterwave.com/v3/banks/NG", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//       },
//     }).json();
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "Error",
//       msg: error.message,
//     });
//   }
// };
// const transferNow = async (req, res) => {
//   const got = require("got");
//   try {
//     let banKCode;
//     const { transaction_id } = req.params;
//     const user = await User.findById(req.user.id);
//     const bank = await Bank.findOne({ userID: req.user.id });
//     const transaction = await Transaction.findOne({ transaction_id });

//     //checking flutterwave supported bank list to get code
//     const bankResponse = await got("https://api.flutterwave.com/v3/banks/NG", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//       },
//     }).json();

//     await bankResponse.data.filter((obj) => {
//       if (obj.name === bank.bank_name) {
//         banKCode = obj.code;
//       }
//     });
//     //Initiating Bank Transfer
//     const details = {
//       account_bank: banKCode || "044",
//       account_number: bank.account_number || "0690000040",
//       amount: transaction.total || 200,
//       currency: "NGN",
//       callback_url:
//         "http://localhost:5000/api/payments/verifyTransfer" ||
//         "https://exqure.herokuapp.com/api/payments/verifyTransfer",
//       narration: transaction.transaction_title || "Payment for things",
//       reference: transaction_id || generateTransactionReference(),
//     };

//     const transferResponse = await flw.Transfer.initiate(details);
//     console.log(transferResponse);
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "Error",
//       msg: error.message,
//     });
//   }
// };

// const verifyTransfer = (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "Error",
//       msg: error.message,
//     });
//   }
// };
module.exports = {
  payWithFlutter,
  verifyFlutterPayment,
  // transferNow,
  // verifyTransfer,
  // listBanks,
};
