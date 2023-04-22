require("dotenv").config();

const BuyerTracker = require("../models/transaction/buyerTransactionTracker");
const SellerTracker = require("../models/transaction/buyerTransactionTracker");
//for images upload
const cloudUpload = require("./cloudinary");

function transPrefix(item) {
  return item.toLowerCase() === "cryptocurrency" ? "cr" : "";
}

function checkTransactionStatus(status) {
  if (status === "pending") {
    return "Pending";
  } else if (status === "accepted") {
    return "Accepted";
  } else if (status === "declined") {
    return "Declined";
  } else if (status === "ongoing") {
    return "Ongoing";
  } else if (status === "done") {
    return "Done";
  }
}

const total = (price, shipping_fee) => {
  const percent = 0.01 * Number(price);
  const sharedCommission = percent / 2;
  const total = Number(price) + Number(shipping_fee) + sharedCommission;
  return total;
};

const fileUpload = async (files) => {
  let imageFiles = files;
  let images = [];
  for (let i = 0; i < imageFiles.length; i++) {
    let filePath = imageFiles[i].path;
    let result = await cloudUpload(filePath);
    images.push(result.url);
  }
  return images;
};

const countDown = (transaction_id) => {
  const trackers = async (transaction_id) => {
    await BuyerTracker.updateOne(
      { transaction_id },
      {
        $set: { "inspection.status": "Time Elapsed", "inspection.daysLeft": 0 },
      }
    );

    await SellerTracker.updateOne(
      { transaction_id },
      {
        $set: { "inspection.status": "Time Elapsed", "inspection.daysLeft": 0 },
      }
    );
  };
  setTimeout(trackers(transaction_id), 20000);
};
module.exports = {
  transPrefix,
  checkTransactionStatus,
  total,
  fileUpload,
  countDown,
};
