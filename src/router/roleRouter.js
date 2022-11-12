const router = require("express").Router();
const roleController = require("../controllers/roleController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  roleController.addRole
);
router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  roleController.getRoles
);
router.post(
  "/search",
  passport.authenticate("user", { session: false }),
  roleController.searchRoles
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  roleController.getRoleById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  roleController.editRole
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  roleController.deleteRoles
);

module.exports = router;
