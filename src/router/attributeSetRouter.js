const router = require("express").Router();
const attributeSetController = require("../controllers/attributeSetController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  attributeSetController.addAttributeSet
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  attributeSetController.getAttributeSet
);
router.get(
  "/search",
  // passport.authenticate("user", { session: false }),
  attributeSetController.searchAttributeSets
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  attributeSetController.getAttributeSetById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  attributeSetController.editAttributeSet
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  attributeSetController.deleteAttributeSet
);

module.exports = router;
