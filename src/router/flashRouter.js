const router = require("express").Router();
const flashSaleController = require("../controllers/flashSaleController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  flashSaleController.addFlashSale
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  flashSaleController.getFlashSales
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  flashSaleController.searchFlashSales
);
// router.get(
//   "/get",
//   passport.authenticate("user", { session: false }),
//   flashSaleController.getFlashSales
// );
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  flashSaleController.getFlashSaleById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  flashSaleController.editFlashSale
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  flashSaleController.deleteFlashSale
);

module.exports = router;
