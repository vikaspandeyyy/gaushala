const router = require("express").Router();
const passport = require("passport");
const transactionController = require("../controllers/transactionController");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  transactionController.getTransactions
);
// router.post(
//   "/search",
//   passport.authenticate("user", { session: false }),
//   transactionController.searchTransactions
// );

module.exports = router;
