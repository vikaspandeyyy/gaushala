const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../src/models/userModel");
const Role = require("../src/models/roleModel");
// const findOrCreate = require("mongoose-findorcreate");
var findOrCreate = require("mongoose-findorcreate");
const jwt = require("jsonwebtoken");
const request = require("request");
const keys = require("./keys");
// const getKeysFromSettings = require("../src/middlewares/getSetting");

passport.serializeUser(function (user, done) {
  // done(null, user.id);
  console.log(user, 1);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
    // console.log(user, "END");
    // done(null, id);
  });
});

// SocialLogins
// Google
// ClientID

// const x = ;
// const x = async () => {
//   return await getKeysFromSettings("SocialLogins", "Google", "ClientID");
// };

const Setting = require("../src/models/settingModel");

const getKeysFromSettings = async (type, name, key) => {
  let data;
  try {
    data = await Setting.find({});
  } catch (err) {
    console.log(err);
  }
  console.log(data[0]["SocialLogins"]["Google"]["ClientID"]);
  return data[0][type][name][key];
};

module.exports = async function (passport) {
  var clientid = await getKeysFromSettings(
    "SocialLogins",
    "Google",
    "ClientID"
  );
  var clientSecret = await getKeysFromSettings(
    "SocialLogins",
    "Google",
    "ClientSecret"
  );

  var callbackURL = await getKeysFromSettings(
    "SocialLogins",
    "Google",
    "CallBackUrl"
  );
  console.log(callbackURL);
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientid,
        clientSecret: clientSecret,
        // clientID: "848087815671-ia1789o5h5v906s4752a6nl7mcb8vpb6.apps.googleusercontent.com",
        // clientSecret: "JOmeiIaP8b-S5xa1aXQ7bQzz",
        // callbackURL: callbackURL,
        callbackURL: "/auth/google/callback",
        // callbackURL: "https://big-cms.herokuapp.com/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile, "Profile");
        // User.find({ googleId: profile.id });
        // let foundUser;
        // try {
        //   foundUser = await User.findOne({ googleId: profile.id });
        // } catch (err) {
        //   console.log(err);
        //   return done(err, profile);
        // }
        process.nextTick(() => {
          User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) {
              return done(err);
            }
            if (user) {
              user.LastLogin = new Date();
              user
                .save()
                .then((loginUser) => {
                  return done(null, loginUser);
                })
                .catch((err) => {
                  return done(err);
                });
              return done(err, user);
            }
            User.findOne({ Email: profile.emails[0].value })
              .then(async (foundUser) => {
                if (foundUser) {
                  foundUser.googleId = profile.id;
                  foundUser.LastLogin = new Date();

                  foundUser
                    .save()
                    .then((updatedUser) => {
                      return done(null, updatedUser);
                    })
                    .catch((err) => {
                      return done(err);
                    });
                } else {

                  let lastUser = [];
                  try {
                    lastUser = await User.find().sort("-createdAt").limit(1);
                  } catch (err) {
                    console.log(err);
                  }

                  // console.log(lastUser);

                  const newId = lastUser[0] ? lastUser[0].ID + 1 : 1;
                  Role.find({ Name: "Customer" })
                    .then((roles) => {
                      const newUser = new User({
                        ID: newId || 1,
                        "First Name": profile.name.givenName,
                        "Last Name": profile.name.familyName,
                        Email: profile.emails[0].value,
                        googleId: profile.id,
                        LastLogin: new Date(),
                        Roles: roles,
                        Permissions: roles[0].Permissions,
                      });

                      const token = jwt.sign(
                        {
                          data: newUser._id,
                        },
                        "secret",
                        {}
                      );
                      newUser.token = token;

                      newUser
                        .save()
                        .then((addedUser) => {
                          return done(null, addedUser);
                        })
                        .catch((err) => {
                          return done(err);
                        });
                    })
                    .catch((err) => {
                      return done(err);
                    });
                }
              })
              .catch((err) => {
                return done(err);
              });
          });
        });
      }
    )
  );
};
