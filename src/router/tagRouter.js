const router = require("express").Router();
const tagController = require("../controllers/tagController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  tagController.addTag
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  tagController.getTags
);
router.get(
  "/get",
  // passport.authenticate("user", { session: false }),
  tagController.searchTags
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  tagController.getTagById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  tagController.editTag
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  tagController.deleteTag
);

module.exports = router;
