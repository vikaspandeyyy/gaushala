const router = require("express").Router();
const passport = require("passport");
const taxController = require("../controllers/taxController");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  taxController.addTax
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  taxController.getTax
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  taxController.searchTax
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  taxController.getTaxById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  taxController.editTax
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  taxController.deleteTax
);

module.exports = router;
