const router = require("express").Router();
const menuController = require("../controllers/menuController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  menuController.addMenu
);
router.post(
  "/menuitem",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  menuController.addMenuItem
);
router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  menuController.getMenus
);
router.get(
  "/search",
  passport.authenticate("user", { session: false }),
  menuController.searchMenus
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  menuController.getMenuById
);
router.get(
  "/menuitem/get/",
  passport.authenticate("user", { session: false }),
  menuController.getMenuItem
);
router.post(
  "/menuitem/changeOrder",
  passport.authenticate("user", { session: false }),
  menuController.changeOrder
);
router.get(
  "/menuitem/get/:id",
  passport.authenticate("user", { session: false }),
  menuController.getMenuItemById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  menuController.editMenu
);
router.put(
  "/menuitem",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  menuController.editMenuItem
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  menuController.deleteMenu
);
router.delete(
  "/menuitem",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  menuController.deleteMenuItem
);

module.exports = router;
