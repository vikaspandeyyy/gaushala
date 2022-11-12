const router = require("express").Router();
const mediaController = require("../controllers/mediaController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");
const fileUpload = require("../middlewares/fileUpload");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  fileUpload.single("image"),
  mediaController.addMedia
);

router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  mediaController.getMedias
);

router.get(
  "/search",
  passport.authenticate("user", { session: false }),
  mediaController.searchMedias
);

router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  mediaController.getMediaById
);

router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  mediaController.deleteMedia
);

module.exports = router;
