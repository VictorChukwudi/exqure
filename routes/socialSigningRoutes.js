const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  googleSigninRedirect,
  facebookSigninRedirect,
} = require("../controllers/socialSigninController");

/**
 * @swagger
 * /api/user/social/google:
 *   get:
 *     summary: signin with google
 *     description: This route facilitates google signin without regular email and password. It redirects to the path " /api/user/social/google.signin " with JWT token output on successful signin
 *     tags:
 *       - Social Signup/Signin
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/user/social/google.signin:
 *   get:
 *     summary: redirect path from google signin
 *     description: This is the path to it redirected to after successful google signin. The output is the status, msg, and data object(which has the userId, email and token properties)
 *     tags:
 *       - Social Signup/Signin
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/user/social/facebook:
 *   get:
 *     summary: signin with facebook
 *     description: This route facilitates facebook signin without regular email and password. It redirects to the path " /api/user/social/facebook.signin " with JWT token output on successful signin
 *     tags:
 *       - Social Signup/Signin
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/user/social/facebook.signin:
 *   get:
 *     summary: redirect path from facebook signin
 *     description: This is the path to it redirected to after successful google signin. The output is the status, msg, and data object(which has the userId, email and token properties)
 *     tags:
 *       - Social Signup/Signin
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 * */

//google signin
router.get(
  "/social/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/social/google.signin",
  passport.authenticate("google"),
  googleSigninRedirect
);

//facebook signin
router.get(
  "/social/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/social/facebook.signin",
  passport.authenticate("facebook"),
  facebookSigninRedirect
);
module.exports = router;
