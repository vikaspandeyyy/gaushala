const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/root",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  categoryController.addRootCategory
);
router.post(
  "/sub",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  categoryController.addSubCategory
);
router.get(
  "/get",
  // passport.authenticate("user", { session: false }),
  categoryController.getRootCategories
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  categoryController.getCategoryById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  categoryController.editCategory
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  categoryController.deleteCategory
);

router.post(
  "/changeOrder",
  passport.authenticate("user", { session: false }),
  categoryController.changeOrder
);
module.exports = router;
