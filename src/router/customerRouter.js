const router = require("express").Router();
const customerController = require("../controllers/customerController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.put(
  "/wishlist",
  passport.authenticate("user", { session: false }),
  customerController.addToWishlist
);
router.delete(
  "/wishlist",
  passport.authenticate("user", { session: false }),
  customerController.deleteFromWishlist
);
router.put(
  "/cart",
  passport.authenticate("user", { session: false }),
  customerController.addToCart
);
router.put(
  "/cart/increase",
  passport.authenticate("user", { session: false }),
  customerController.setQty
);
router.delete(
  "/cart",
  passport.authenticate("user", { session: false }),
  customerController.deleteFromCart
);

module.exports = router;
