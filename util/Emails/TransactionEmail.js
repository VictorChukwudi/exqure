require("dotenv").config();
const transporter = require("../../config/nodemailer");
const User = require("../../models/user/user");
const Transaction = require("../../models/transaction/transactionDetails");
const express = require("express");

const transactionMail = async (username, email, link, res) => {
  const mailOptions = {
    from: process.env.STARTUP_EMAIL,
    to: email,
    subject: "Transaction Contract Agreement",
    html: `<p>${username} invites you to accept/decline this transaction contract. Click <b><a href="${link}">here</a></b> to view the contract</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({
        status: "Error",
        msg: "Server Error",
      });
    } else {
      res.status(200).json({
        status: "Success",
        msg: "Transaction Invite sent",
      });
    }
  });
};

module.exports = {
  transactionMail,
};
