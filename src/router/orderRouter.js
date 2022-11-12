const router = require("express").Router();
const orderController = require("../controllers/orderController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  orderController.addOrder
);
router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  orderController.getOrders
);
router.post(
  "/search",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  orderController.searchOrders
);
router.post(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  orderController.getOrderById
);
router.get(
  "/get/user/:userId",
  passport.authenticate("user", { session: false }),
  orderController.getOrdersByUserId
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  orderController.editOrder
);

module.exports = router;
