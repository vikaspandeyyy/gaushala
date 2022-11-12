const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const User = mongoose.model("users");
// const Account = mongoose.model("account");
const keys = require("./keys");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromHeader("token");
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    "user",
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.data)
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => console.log(err));
    })
  );
  // passport.use(
  //   "customer",
  //   new JwtStrategy(opts, (jwt_payload, done) => {
  //     Account.findById(jwt_payload.data)
  //       .then((customer) => {
  //         if (customer) {
  //           return done(null, customer);
  //         } else {
  //           return done(null, false);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   })
  // );
  passport.use(
    "admin",
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.data)
        .then((user) => {
          if (user && user.Roles.includes("Admin")) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => console.log(err));
    })
  );
};
