const router = require("express").Router();
const settingController = require("../controllers/settingController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

// router.post(
//   "/",
//   passport.authenticate("user", { session: false }),
//   hasPermissions,
//   settingController.addOption
// );
router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  settingController.getSettings
);
router.get(
  "/get/hidden",
  // passport.authenticate("user", { session: false }),
  settingController.getSettingsSensitiveHidden
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  settingController.editSettings
);

module.exports = router;
