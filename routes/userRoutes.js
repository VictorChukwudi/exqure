const express = require("express");
const router = express.Router();
const {
  signup,
  signIn,
  twoFASignin,
  verifyOTP,
  resendOTP,
  requestResetPassword,
  resetPassword,
  getUsers,
} = require("../controllers/userController");
const { validateReset } = require("../middleware/passwordReset");
const { signupValidate, signinValidate } = require("../middleware/validator");
// const twoFA_Enabled = require("../middleware/2FAverifyStatus");

router.get("/", getUsers);

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     description: This enables the creation of a new user account.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signup'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signup'
 *       500:
 *         description: Server error
 *       400:
 *         description: Bad request
 *
 * */

/**
 * @swagger
 * /api/user/verifyOTP:
 *   post:
 *     summary: verifies new user
 *     description: On creation of a new account, the new user receives a verification OTP to verify his/her password. This endpoint receives the OTP as the body to verify the user's email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/verifyOTP'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verifyOTP'
 *       400:
 *         description: Bad request
 *       408:
 *         description: Request timeout
 *       422:
 *         description: Unprocessable Entity
 *
 * */

/**
 * @swagger
 * /api/user/resendOTP:
 *   post:
 *     summary: Resend otp to verify new user
 *     description: Resends the email verification OTP incase the user has not verified his/her email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resendOTP'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verifyOTP'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 *
 * */

/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: New user signs in
 *     description: A new user can sign in after verifying his/her email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signin'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signin'
 *       400:
 *         description: Bad request
 * */

/**
 * @swagger
 * /api/user/twoFASignin?email=johndoe@example.com:
 *   post:
 *     summary: user signs in with 2FA token from mail
 *     description: This endpoint is used to sign in users that have enabled two-factor authentication. This receives the token sent to the user's email after entering the user's email address and password in the regular signin route.
 *     tags:
 *       - User
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/twoFASignin'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/twoFASignin'
 *       401:
 *         description: Unauthorized
 * */

/**
 * @swagger
 * /api/user/requestResetPassword:
 *   post:
 *     summary: Get link to reset password
 *     description: Here, a user can request to reset his/her password incase they he/she forgets it.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/requestResetPassword'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/requestResetPassword'
 *       400:
 *         description: Bad request
 * */

/**
 * @swagger
 * /api/user/resetPassword/{userID}/{resetToken}:
 *   patch:
 *     summary: Reset password
 *     description: This is a unique link sent to the email on request reset password.
 *     tags:
 *       - User
 *     parameters:
 *       - name: userID
 *         in: path
 *         description: a unique user id
 *         required: true
 *       - name: resetToken
 *         in: path
 *         description: a unique reset token
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resetPassword'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/resetPassword'
 *       400:
 *         description: Bad request
 * */

router.post("/signup", signupValidate, signup);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);
router.post("/signin", signinValidate, signIn);
router.post("/twoFASignin", twoFASignin);
router.post("/requestResetPassword", requestResetPassword);
router.patch(
  "/resetPassword/:userID/:resetToken",
  validateReset,
  resetPassword
);

module.exports = router;
