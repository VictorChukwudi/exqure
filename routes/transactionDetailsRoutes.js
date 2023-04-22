const express = require("express");
const upload = require("../util/multer");
const {
  createTransaction,
  getTransactions,
  sendInviteTransactionMsg,
  viewTransactionInvite,
  acceptContract,
  declineContract,
  getTrackedTransactions,
  addShippingDetails,
  confirmYesDelivery,
  confirmNoDelivery,
} = require("../controllers/transactionController");
const {
  canAccessTransaction,
  acceptOrDecline,
} = require("../middleware/statusProtect");
const {
  transactionValidate,
  shippingValidate,
} = require("../middleware/validator");
const checkUpload = require("../middleware/multerError");
const {
  confirmPayment,
  checkForBuyer,
  checkIfDelivered,
} = require("../middleware/transactionConfirmation");
const router = express.Router();

/**
 * @swagger
 * /api/transaction:
 *   get:
 *     summary: gets all transaction contract
 *     description: All transactions made are viewed through this endpoint. This route is a protected route.
 *     tags:
 *       - Transaction
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request

 * */
router.get("/", getTransactions);
router.get("/mytransactions", getTrackedTransactions);

/**
 * @swagger
 * /api/transaction/createTransaction:
 *   post:
 *     summary: Create new transaction
 *     description: Either parties creates a transaction with this route. All the fields are required. This route is a protected route.
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/createTransaction'
 *     responses:
 *       201:
 *         description: Transaction Created
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/createTransaction'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/transaction/invite/{transaction_id}:
 *   post:
 *     summary: invite second party to transaction
 *     description: This is a link  used to send the transaction link to the second party involved in the transaction. It can be sent to the party's email . This route is a protected route.
 *     tags:
 *       - Transaction
 *     parameters:
 *       - name: transaction_id
 *         in: path
 *         description: a transaction id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/inviteMsg'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/inviteMsg'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 * */
/**
 * @swagger
 * /api/transaction/view/{transaction_id}:
 *   get:
 *     summary: views the transaction contract
 *     description: This link displays the transaction contract. When the invite link sent to the second party's email is clicked, this open. This is also the link copied to the second party. This route is a protected route.
 *     tags:
 *       - Transaction
 *     parameters:
 *       - name: transaction_id
 *         in: path
 *         description: a transaction id
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request

 * */

/**
 * @swagger
 * /api/transaction/accept/{transaction_id}:
 *   patch:
 *     summary: accepts the transaction contract
 *     description: When clicked, contract is being accepted by second party. This route is a protected route.
 *     tags:
 *       - Transaction
 *     parameters:
 *       - name: transaction_id
 *         in: path
 *         description: a transaction id
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request

 * */

/**
 * @swagger
 * /api/transaction/decline/{transaction_id}:
 *   patch:
 *     summary: accepts the transaction contract
 *     description: When clicked, contract is being declined by second party. This route is a protected route.
 *     tags:
 *       - Transaction
 *     parameters:
 *       - name: transaction_id
 *         in: path
 *         description: a transaction id
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request

 * */

router.post(
  "/createTransaction",
  checkUpload,
  transactionValidate,
  createTransaction
);
router.get("/view/:transaction_id", viewTransactionInvite);
router.post("/invite/:transaction_id", sendInviteTransactionMsg);
router.patch("/accept/:transaction_id", canAccessTransaction, acceptContract);
router.patch(
  "/decline/:transaction_id",
  canAccessTransaction,
  acceptOrDecline,
  declineContract
);
router.post(
  "/shipItem/:transaction_id",
  confirmPayment,
  shippingValidate,
  addShippingDetails
);
router.patch(
  "/confirm.yes.delivery/:transaction_id",
  checkForBuyer,
  checkIfDelivered,
  confirmYesDelivery
);
router.patch(
  "/confirm.no.delivery/:transaction_id",
  checkForBuyer,
  checkIfDelivered,
  confirmNoDelivery
);
module.exports = router;
