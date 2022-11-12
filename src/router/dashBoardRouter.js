const router = require("express").Router();
const dashBoardController = require("../controllers/dashBoardController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

// router.post('/',passport.authenticate("user", { session: false }),hasPermissions, dashBoardController.addCoupon);
router.get(
  "/orders",
  passport.authenticate("user", { session: false }),
  dashBoardController.getTotalOrders
);
router.get(
  "/products",
  passport.authenticate("user", { session: false }),
  dashBoardController.getTotalProucts
);
router.get(
  "/latest/reviews",
  passport.authenticate("user", { session: false }),
  dashBoardController.getLatestReviews
);
router.get(
  "/latest/orders",
  passport.authenticate("user", { session: false }),
  dashBoardController.getLatestOrders
);
router.post(
  "/customers",
  passport.authenticate("user", { session: false }),
  dashBoardController.getTotalCustomers
);

module.exports = router;

