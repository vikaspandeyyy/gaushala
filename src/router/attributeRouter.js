const router = require("express").Router();
const attributeController = require("../controllers//attributeController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  attributeController.addAttribute
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  attributeController.getAttribute
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  attributeController.searchAttributes
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  attributeController.getAttributeById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  attributeController.editAttribute
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  attributeController.deleteAttribute
);

module.exports = router;
