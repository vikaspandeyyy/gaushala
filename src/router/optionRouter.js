const router = require("express").Router();
const optionController = require("../controllers/optionsController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  optionController.addOption
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  optionController.getOptions
);
router.get(
  "/search",
  // passport.authenticate("user", { session: false }),
  optionController.searchOptions
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  optionController.getOptionById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  optionController.editOption
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  optionController.deleteOption
);

module.exports = router;
