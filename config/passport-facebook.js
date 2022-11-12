const passport = require("passport");
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
  var clientid = await getKeysFromSettings("SocialLogins", "Facebook", "AppID");
  var clientSecret = await getKeysFromSettings(
    "SocialLogins",
    "Facebook",
    "Appsecret"
  );

  var callbackURL = await getKeysFromSettings(
    "SocialLogins",
    "Facebook",
    "CallBackUrl"
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: clientid,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
        profileFields: ["id", "displayName", "photos", "emails"],
      },
      function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        console.log(profile, "Profile");
        console.log(profile.emails, "Emails");
        console.log(profile.email, "Email");

        let url =
          "https://graph.facebook.com/v3.2/me?" +
          "fields=id,name,email,first_name,last_name&access_token=" +
          accessToken;

        request(
          {
            url: url,
            json: true,
          },
          function (err, response, body) {
            let email = body.email; // body.email contains your email
            console.log(body);

            User.findOne({ facebookId: profile.id }, (err, user) => {
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
              User.findOne({ Email: email })
                .then((foundUser) => {
                  if (foundUser) {
                    foundUser.facebookId = profile.id;

                    foundUser
                      .save()
                      .then((updatedUser) => {
                        return done(null, updatedUser);
                      })
                      .catch((err) => {
                        return done(err);
                      });
                  } else {
                    Role.find({ Name: "Customer" })
                      .then((roles) => {
                        const newUser = new User({
                          "First Name": body.first_name,
                          "Last Name": body.last_name,
                          Email: email,
                          facebookId: profile.id,
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
          }
        );

        // done(null, profile);
      }
    )
  );
};
