const router = require("express").Router();
const reviewController = require("../controllers/reviewController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  reviewController.addReview
);
router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  reviewController.getReviews
);
router.get(
  "/search",
  passport.authenticate("user", { session: false }),
  reviewController.searchReviews
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  reviewController.getReviewById
);
router.get(
  "/get/user/:userId",
  passport.authenticate("user", { session: false }),
  reviewController.getReviewByUser
);
router.get(
  "/get/product/:productId",
  // passport.authenticate("user", { session: false }),
  reviewController.getReviewByProduct
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  // hasPermissions,
  reviewController.editReview
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  // hasPermissions,
  reviewController.deleteReviews
);

module.exports = router;
