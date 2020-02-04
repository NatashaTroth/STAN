const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");

//Load User Model
const { User } = require("../models");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    console.log("LocalStrategy");
    //Match User
    User.findOne({ email: email }).then(user => {
      if (!user) {
        //done is callback done(error, user, options)
        return done(null, false, { message: "That email is not registered" });
      }

      //Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password is incorrect" });
        }
      });
      //TODO: CREATE VALIDPASSWORD METHOD
      // if (!user.validPassword(password)) {
      //       return done(null, false, { message: "Incorrect password." });
      //     }
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
