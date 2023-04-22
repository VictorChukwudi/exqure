const express = require("express");
const {
  enable2FAViaEmail,
  verify2FAtoken,
} = require("../controllers/securitySettingsController");
const {
  fillPaymentDetails,
  updatePaymentDetails,
  allPaymentDetails,
  addCardDetails,
  removeCardDetails,
  updateIndividualProfile,
  updateCompanyProfile,
  getAllCards,
  changePassword,
} = require("../controllers/userAccountSettingsController");
const twoFA_Enabled = require("../middleware/2FAverifyStatus");
const {
  paymentSettingValidate,
  cardDetailValidate,
  changePasswordValidate,
} = require("../middleware/validator");
const router = express.Router();

//This endpoint below is only for testing or can be made available to only a user to be called admin

/**
 * @swagger
 * /api/account/paymentDetails:
 *   get:
 *     summary: gets all payment details
 *     description: This route is a protected route.
 *     tags:
 *       - Account Setting
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request

 * */

router.get("/paymentDetails", allPaymentDetails);

/**
 * @swagger
 * /api/account/personalDetails:
 *   patch:
 *     summary: update personal details
 *     description: Users can update already existing personal details. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/personalDetails'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/personalDetails'
 *       500:
 *         description: Server Error

 * */

/**
 * @swagger
 * /api/account/companyDetails:
 *   patch:
 *     summary: update company details
 *     description: Users can update company details. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/companyDetails'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/companyDetails'
 *       500:
 *         description: Server Error

 * */

/**
 * @swagger
 * /api/account/changePassword:
 *   patch:
 *     summary: change password
 *     description: Verified users can change/create new account password. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/changePassword'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/changePassword'
 *       400:
 *         description: Bad Request

 * */

/**
 * @swagger
 * /api/account/paymentDetails:
 *   post:
 *     summary: fill payment details
 *     description: Payment details such as bank verification number, account number, etc. are to be filled to enable transaction. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/paymentDetails'
 *     responses:
 *       201:
 *         description: Details filled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/paymentDetails'
 *       400:
 *         description: Bad request
 * */

/**
 * @swagger
 * /api/account/CardDetails:
 *   post:
 *     summary: add card details
 *     description: User adds card details to make payments with card. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/cardDetails'
 *     responses:
 *       201:
 *         description: Card details added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/cardDetails'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 * */

/**
 * @swagger
 * /api/account/CardDetails/{userID}/:
 *   get:
 *     summary: cards viewing
 *     description: This endpoint is used to view all cards added by user. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     parameters:
 *       - name: userID
 *         in: path
 *         description: user's id
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found

 * */

/**
 * @swagger
 * /api/account/updatePaymentDetails/{userID}:
 *   patch:
 *     summary: update already existing payment details
 *     description: This endpoint updates already existing user payment details. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     parameters:
 *       - name: userID
 *         in: path
 *         description: user's id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/paymentDetails'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/paymentDetails'
 *       500:
 *         description: Server Error

 * */

/**
 * @swagger
 * /api/account/removeCardDetails/{userID}/{cardID}:
 *   delete:
 *     summary: card details removal
 *     description: This endpoint remove/delete user's card details. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     parameters:
 *       - name: userID
 *         in: path
 *         description: user's id
 *         required: true
 *       - name: detailsID
 *         in: path
 *         description: card details id when card was added
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found

 * */

/**
 * @swagger
 * /api/account/enable2FAViaEmail:
 *   get:
 *     summary: gets 2FA enrollment OTP sent to user's email
 *     description:  This endpoint sends 2FA enrollment OTP to activate Two-Factor Authentication. This route is a protected route.
 *     tags:
 *       - Account Setting
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Bad Request

 * */

/**
 * @swagger
 * /api/account/verify2FAToken:
 *   post:
 *     summary: user verifies 2FA OTP
 *     description: This endpoint receives the enrollment OTP as the request body and enables 2FA for a user's account. This is a protected route.
 *     tags:
 *       - Account Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/verify2FA'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verify2FA'
 *       400:
 *         description: Bad Request
 * */
router.patch("/personalDetails", updateIndividualProfile);
router.patch("/companyDetails", updateCompanyProfile);
router.patch("/changePassword", changePasswordValidate, changePassword);
router.post("/paymentDetails", paymentSettingValidate, fillPaymentDetails);
router.post("/CardDetails", cardDetailValidate, addCardDetails);
router.get("/cardDetails/:userID", getAllCards);

router.patch("/updatePaymentDetails/:userID", updatePaymentDetails);
router.delete("/removeCardDetails/:userID/:cardID", removeCardDetails);

//Two-Factor Authentication routes
router.get("/enable2FAViaEmail", twoFA_Enabled, enable2FAViaEmail);
router.post("/verify2FAToken", twoFA_Enabled, verify2FAtoken);
module.exports = router;
