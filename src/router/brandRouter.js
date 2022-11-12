const router = require("express").Router();
const brandController = require("../controllers/brandController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");
const fileUpload = require("../middlewares/fileUpload");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  brandController.addBrand
);
router.post(
  "/get",
  brandController.getBrand
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  brandController.getBrandById
);
router.post(
  "/search",
  brandController.searchBrands
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  brandController.editBrand
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  brandController.deleteBrand
);

module.exports = router;
