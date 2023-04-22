const express = require("express");
const router = express.Router();
const {
  payWithFlutter,
  verifyFlutterPayment,
  // transferNow,
  // listBanks,
} = require("../controllers/paymentAndTransfers.js");
const { acceptedBeforePayment } = require("../middleware/BeforePayment");
/**
 * @swagger
 * /api/payments/payWithFlutter/{transaction_id}:
 *   get:
 *     summary: views the transaction contract
 *     description: User(buyer) clicks the endpoint to make payment after contract has been accepted. The user is directed to flutterwave page to complete payment.This route is a protected route.
 *     tags:
 *       - Payments and Transfers
 *     parameters:
 *       - name: transaction_id
 *         in: path
 *         description: a transaction id
 *         required: true
 *     responses:
 *       301:
 *         description: temporary Redirect
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/payments/verifyFlutterPayment:
 *   get:
 *     summary: verify the success/failure of the payment
 *     description: After making payment through flutterwave, user is redirected to this endpoint for confirmation of success or failure of payment. On re-direction, Exqure's transaction_id (tx_ref) and Flutterwave's transaction_id(transaction_id) with be appended to the endpoint as query parameters .This route is a protected route.
 *     tags:
 *       - Payments and Transfers
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 * */
// router.get("/getBanks", listBanks);
router.get("/verifyFlutterPayment", verifyFlutterPayment);
router.get(
  "/payWithFlutter/:transaction_id",
  acceptedBeforePayment,
  payWithFlutter
);
// router.get("/transferNow/:transaction_id", transferNow);

module.exports = router;
