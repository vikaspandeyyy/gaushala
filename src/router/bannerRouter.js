const router = require("express").Router();
const bannerController = require("../controllers/bannerController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  bannerController.addBanner
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  bannerController.getBlogs
);
router.get(
  "/get/:id",
  //   passport.authenticate("user", { session: false }),
  bannerController.getBlogById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  bannerController.editBanner
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  bannerController.deleteBanner
);

module.exports = router;
