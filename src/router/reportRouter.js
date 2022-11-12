const router = require("express").Router();
const reportController = require("../controllers/reportController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/branded_products",
  passport.authenticate("user", { session: false }),
  reportController.getBrandReport
);
router.post(
  "/categorized_products",
  passport.authenticate("user", { session: false }),
  reportController.getCategoryReport
);
router.post(
  "/tagged_products",
  passport.authenticate("user", { session: false }),
  reportController.getTagReport
);
router.post(
  "/products_purchase",
  passport.authenticate("user", { session: false }),
  reportController.getProductsPurchaseReports
);
router.post(
  "/customer_order",
  passport.authenticate("user", { session: false }),
  reportController.getCustomersOrderReport
);
router.post(
  "/shipping",
  passport.authenticate("user", { session: false }),
  reportController.getShippingReport
);
router.post(
  "/product_stock",
  passport.authenticate("user", { session: false }),
  reportController.getProductStock
);

module.exports = router;
