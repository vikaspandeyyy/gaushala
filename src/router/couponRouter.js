const router = require("express").Router();
const couponController = require("../controllers/couponController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  couponController.addCoupon
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  couponController.getCoupons
);
router.post(
  "/valid",
  // passport.authenticate("user", { session: false }),
  couponController.getValidCouponByProduct
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  couponController.searchCoupons
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  couponController.getCouponById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  couponController.editProduct
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  couponController.deleteCoupons
);

module.exports = router;
