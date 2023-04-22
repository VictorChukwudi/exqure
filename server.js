require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const passport = require("passport");
const session = require("express-session");
const { googleStrategy, facebookStrategy } = require("./config/passport");

const swaggerOptions = require("./config/docs");

const jwtAuthenticated = require("./middleware/jwtAuthenticate");
const verifyEmail = require("./middleware/verifyEmail");

const app = express();
const port = process.env.PORT || 8000;

//database connection
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cross-origin middleware
app.use(
  cors({
    origin: "*",
  })
);

//server security middlewares
app.use(helmet());
app.use(mongoSanitize());

//documentation middleware
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Google signin
googleStrategy(passport);

//facebook signin
facebookStrategy(passport);

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/user", require("./routes/socialSigningRoutes"));
app.use(
  "/api/account",
  jwtAuthenticated,
  verifyEmail,
  require("./routes/accountSettingsRoutes")
);
app.use(
  "/api/transaction",
  jwtAuthenticated,
  verifyEmail,
  require("./routes/transactionDetailsRoutes")
);
app.use(
  "/api/payments",
  jwtAuthenticated,
  verifyEmail,
  require("./routes/paymentAndTransfersRoutes")
);

//blog routes
app.use("/api/blog", require("./routes/blogRoutes"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
