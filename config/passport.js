require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { request } = require("express");
const User = require("../models/user/user");
//https://exqure.herokuapp.com/api/user/social/google.signin
const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          "https://exqure.herokuapp.com/api/user/social/google.signin",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // const findUser = await User.findOne({
          //   email: profile.emails[0].value,
          // });
          const findUser = await User.findOne({
            $or: [
              { email: profile.emails[0].value },
              { google_ID: profile.id },
            ],
          });
          if (findUser) {
            await User.findOneAndUpdate(
              { email: profile.emails[0].value },
              { $set: { google_ID: profile.id } }
            );
            return done(null, findUser);
          } else {
            const user = new User({
              fullname: profile.displayName,
              google_ID: profile.id,
              email: profile.emails[0].value,
            });
            await user.save();
            await User.findOneAndUpdate(
              { email: profile.emails[0].value },
              { $set: { verified: true } }
            );
            return done(null, user);
          }
        } catch (error) {
          console.log(error);
          return done(error, false);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

const facebookStrategy = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/api/user/social/facebook.signin",
        profileFields: ["id", "first_name", "last_name", "email"],
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          if (!profile._json.email) {
            return done(null, false, {
              message: " Facebook Account not registered with email",
            });
          } else {
            const findUser = await User.findOne({
              $or: [
                { email: profile._json.email },
                { facebook_ID: profile._json.id },
              ],
            });
            if (findUser) {
              await User.findOneAndUpdate(
                { email: profile.emails[0].value },
                { $set: { facebook_ID: profile._json.id } }
              );
              return done(null, findUser);
            } else {
              const user = new User({
                fullname: `${profile._json.first_name} ${profile._json.last_name}`,
                facebook_ID: profile._json.id,
                email: profile._json.email,
              });
              await user.save();
              await User.findOneAndUpdate(
                { email: profile.emails[0].value },
                { $set: { verified: true } }
              );
              return done(null, user);
            }
          }
        } catch (error) {
          console.log(error);
          return done(error, false, { message: "Server Error" });
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
module.exports = {
  googleStrategy,
  facebookStrategy,
};
