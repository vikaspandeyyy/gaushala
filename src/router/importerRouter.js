const router = require("express").Router();
const importerController = require("../controllers/importerController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");
const csvFileUpload = require("../middlewares/csvUpload");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  csvFileUpload.single("csv"),
  importerController.addImporter
);

// router.get(
//   "/get",
//   passport.authenticate("user", { session: false }),
//   importerController.getImporter
// );

// router.get(
//   "/get/:id",
//   passport.authenticate("user", { session: false }),
//   importerController.getImporterById
// );

module.exports = router;
