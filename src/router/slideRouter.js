const router = require("express").Router();
const slidesController = require("../controllers/sliderController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  slidesController.addSlide
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  slidesController.getSlides
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  slidesController.searchSlides
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  slidesController.getSlideById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  slidesController.editSlides
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  slidesController.deleteSlides
);

module.exports = router;
