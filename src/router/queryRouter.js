const router = require("express").Router();

const passport = require("passport");
const queryController = require("../controllers/queryController");
const hasPermissions = require("../utils/permissionChecker");
const fileUpload = require("../middlewares/fileUpload");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  //   hasPermissions,
  // fileUpload.single("image"),
  queryController.addQuery
);

router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  queryController.getQueries
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  queryController.getQueryById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  //   hasPermissions,
  queryController.editQuery
);

// router.delete(
//   "/",
//   passport.authenticate("user", { session: false }),
//   hasPermissions,
//   queryController.deleteProducts
// );

// router.post("/filter", queryController.filterProducts);

module.exports = router;
