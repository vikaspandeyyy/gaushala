const router = require("express").Router();
const blogController = require("../controllers/blogController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");
const fileUpload = require("../middlewares/fileUpload");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  blogController.addBlog
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  blogController.getBlogs
);
router.get(
  "/get/:id",
  //   passport.authenticate("user", { session: false }),
  blogController.getBlogById
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  blogController.searchBlogs
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  blogController.editBlog
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  blogController.deleteBlog
);

module.exports = router;
