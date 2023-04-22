require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.STARTUP_EMAIL,
    pass: process.env.STARTUP_EMAIL_PASSWORD,
  },
});

module.exports = transporter;
