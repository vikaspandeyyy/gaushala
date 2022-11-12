const router = require("express").Router();
// const attributeSetController = require("../controllers/attributeSetController");
const passport = require("passport");
// const { gettingGoogleKeys } = require("../../config/passport-setup");
const isLoggedIn = require("../middlewares/isLoggedIn");
const keys = require("../../config/keys");
// const Setting = require("../models/settingModel");

let initPassport = require("../../config/passport-setup");
initPassport(passport)
  .then(() => {
    console.log("Passport Initialised successfully [GOOGLE]");
    // console.log(keys.BASE_URL);

    router.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    router.get(
      "/google/callback",
      passport.authenticate("google", { failureRedirect: "/auth/failed" }),
      function (req, res) {
        // Successful authentication, redirect home.
        // <<<<<<< HEAD
        // <<<<<<< HEAD
        //         // res.redirect('/auth/good')
        //         res.redirect(`http://lokostop.in?token=${req.user.token}`);
        //         res.status(200).json({ status: true, data: req.user })

        res.redirect(
          `${keys.BASE_URL}?token=${req.user.token}&id=${req.user._id}`
        );
        // res.status(200).json({ status: true, data: req.user })
      }
    );
  })
  .catch((err) => {
    //console.log(err);
    console.log("Couldn't connect to google");
  });

let initPassportFacebook = require("../../config/passport-facebook");
initPassportFacebook(passport)
  .then(() => {
    //console.log("Passport Initialised successfully [FACEBOOK]");

    router.get(
      "/facebook",
      passport.authenticate("facebook", { scope: ["email"] })
    );

    router.get(
      "/facebook/callback",
      passport.authenticate("facebook", { failureRedirect: "/auth/failed" }),
      function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/auth/good");
      }
    );
  })
  .catch((err) => {
    //console.log(err);
    console.log("Couldn't connect to facebook!");
  });

router.get("/failed", (req, res) =>
  res.status(400).json({ status: false, message: "Could not authenticate!" })
);
router.get("/good", isLoggedIn, (req, res) =>
  res.status(200).json({ status: true, data: req.user })
);

router.get("/notLoggedIn", (req, res) =>
  res.status(200).json({ status: true, message: "Logged Out!" })
);

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/auth/notLoggedIn");
});

// router.get("/facebook", passport.authenticate("facebook"));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/auth/failed" }),
//   function (req, res) {
//     res.redirect("/auth/good");
//   }
// );

module.exports = router;
