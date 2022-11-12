const router = require("express").Router();
const currencyRateController = require("../controllers/currencyRateController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.get(
  "/",
  passport.authenticate("user", { session: false }),
  //   hasPermissions,
  currencyRateController.fetchCurrencyRates
);

router.get(
  "/get/",
  passport.authenticate("user", { session: false }),
  currencyRateController.getCurrency
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  currencyRateController.getCurrencyById
);

router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  currencyRateController.updateCurrency
);
module.exports = router;
