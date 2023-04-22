require("dotenv").config();
const bcrypt = require("bcryptjs/dist/bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/user/user");
const userCardDetails = require("../models/user/userCardDetails");
const userPaymentSetting = require("../models/user/userPaymentSettings");

const allPaymentDetails = async (req, res) => {
  try {
    const allDetails = await userPaymentSetting.find();
    res.json({
      status: "Success",
      data: await userPaymentSetting.find().select(["-__v"]),
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const fillPaymentDetails = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    const { bvn, bank_name, account_number, account_name } = req.body;
    const userID = req.user.id;

    userPaymentSetting
      .findOne({ userID })
      .then((result) => {
        if (result) {
          res.status(400);
          throw Error("Payment Details filled already");
        } else {
          const userPaymentDetails = new userPaymentSetting({
            userID,
            bvn,
            bank_name,
            account_number,
            account_name,
          });

          userPaymentDetails.save().then((data) => {
            res.status(201).json({
              status: "Success",
              msg: "Payment Details filled",
              data,
            });
          });
        }
      })
      .catch((error) => {
        res.json({
          status: "Error",
          msg: error.message,
        });
      });
  }
};
const updatePaymentDetails = async (req, res) => {
  try {
    const { userID } = req.params;
    const { bvn, bank_name, account_number, account_name } = req.body;
    const paymentDetails = await userPaymentSetting.findOne({ userID });
    const update = {
      bvn: bvn || paymentDetails.bvn,
      bank_name: bank_name || paymentDetails.bank_name,
      account_number: account_number || paymentDetails.account_number,
      account_name: account_name || paymentDetails.account_name,
    };

    const changesMade = await userPaymentSetting.updateOne(
      { userID },
      { $set: update },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      msg: "Changes Saved",
      data: await userPaymentSetting
        .findOne({ userID })
        .select(["-_id", "-__v"]),
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const addCardDetails = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    const userID = req.user.id;
    const { card_number, cvv, expiry_date, card_holder_name } = req.body;
    const newCardDetails = new userCardDetails({
      userID,
      card_number,
      cvv,
      expiry_date,
      card_holder_name,
    });

    newCardDetails
      .save()
      .then((result) => {
        res.status(201).json({
          status: "Success",
          msg: "Card details added",
          cardDetails: {
            cardID: result._id,
            userID: result.userID,
            card_number: result.card_number,
            cvv: result.cvv,
            expiry_date: result.expiry_date,
            card_holder_name: result.card_holder_name,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          status: "Error",
          msg: error.message,
        });
      });
  }
};
const removeCardDetails = async (req, res) => {
  try {
    const userID = req.params.userID;
    const cardID = req.params.cardID;
    const userDetails = await userCardDetails.find({ userID });
    if (!userDetails) {
      throw Error("No Card Details currently");
    } else {
      const cardRemove = await userCardDetails
        .findByIdAndDelete({
          _id: cardID,
        })
        .select(["-__v", "-_id"]);
      if (!cardRemove) {
        res.status(400).json({
          status: "Error",
          msg: "Card already removed. You can add another card.",
        });
      } else {
        res.status(200).json({
          status: "Success",
          msg: "Card Details removed",
          data: cardRemove,
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const getAllCards = async (req, res) => {
  try {
    const userID = req.params.userID;
    const allCard = await userCardDetails.find({ userID });
    if (!allCard || allCard.length < 1) {
      throw Error("No card currently.");
    } else {
      res.status(200).json({
        status: "Success",
        data: allCard,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "Error",
      msg: error.message,
    });
  }
};
const updateIndividualProfile = async (req, res) => {
  try {
    const {
      account_type,
      fullname,
      phone,
      alt_phone,
      country,
      dob,
      billing_address,
      city,
      state,
      zipOrPostCode,
    } = req.body;
    const user = await User.findById(req.user.id);
    const update = {
      account_type: account_type || user.account_type,
      fullname: fullname || user.fullname,
      phone: phone || user.phone,
      alt_phone: alt_phone || user.alt_phone,
      country: country || user.country,
      dob: dob || user.dob,
      billing_address: billing_address || user.billing_address,
      city: city || user.city,
      state: state || user.state,
      zipOrPostCode: zipOrPostCode || user.zipOrPostCode,
    };

    const personalDetails = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true }
    ).select(["-__v", "-verified", "-password", "-email", "-_id"]);
    if (!personalDetails) {
      throw Error("Error");
    } else {
      res.status(200).json({
        status: "Success",
        personalDetails,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const updateCompanyProfile = async (req, res) => {
  try {
    const {
      account_type,
      fullname,
      company_name,
      company_email,
      phone,
      alt_phone,
      country,
      dob,
      billing_address,
      city,
      state,
      zipOrPostCode,
    } = req.body;
    const user = await User.findById(req.user.id);
    const update = {
      account_type: account_type || user.account_type,
      fullname: fullname || user.fullname,
      company_name: company_name || user.company_name,
      company_email: company_email || user.company_email,
      phone: phone || user.phone,
      alt_phone: alt_phone || user.alt_phone,
      country: country || user.country,
      dob: dob || user.dob,
      billing_address: billing_address || user.billing_address,
      city: city || user.city,
      state: state || user.state,
      zipOrPostCode: zipOrPostCode || user.zipOrPostCode,
    };

    const companyDetails = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true }
    ).select(["-__v", "-verified", "-password", "-email", "-_id"]);
    if (!companyDetails) {
      throw Error("Error");
    } else {
      res.status(200).json({
        status: "Success",
        companyDetails,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { new_password, confirmpassword } = req.body;
      const _id = req.user.id;
      const user = await User.findById(_id);

      if (await bcrypt.compare(new_password, user.password)) {
        throw Error("Change password to a new password");
      } else {
        const password = await bcrypt.hash(new_password, 10);
        await User.findByIdAndUpdate(_id, { $set: { password } });
        res.status(200).json({
          status: "Success",
          msg: "Password successfully changed",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message || "An error occurred",
    });
  }
};
module.exports = {
  allPaymentDetails,
  fillPaymentDetails,
  updatePaymentDetails,
  addCardDetails,
  removeCardDetails,
  getAllCards,
  updateIndividualProfile,
  updateCompanyProfile,
  changePassword,
};
