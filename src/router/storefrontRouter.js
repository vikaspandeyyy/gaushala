const router = require("express").Router();
const storefrontController = require("../controllers/storefrontController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

// router.post(
//   "/",
//   passport.authenticate("user", { session: false }),
//   hasPermissions,
//   storefrontController.addOption
// );
router.get(
  "/get",
  passport.authenticate("user", { session: false }),
  storefrontController.getStorefront
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  storefrontController.getStorefrontSelect
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  storefrontController.editStorefront
);

module.exports = router;
