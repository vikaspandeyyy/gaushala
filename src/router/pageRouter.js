const router = require("express").Router();
const pageController = require("../controllers/pageController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  pageController.addPage
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  pageController.getPages
);
router.get(
  "/search",
  passport.authenticate("user", { session: false }),
  pageController.searchPages
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  pageController.getPageById
);
router.get(
  "/url/:url",
  // passport.authenticate("user", { session: false }),
  pageController.getPageByUrl
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  pageController.editPage
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  pageController.deletePage
);

module.exports = router;
