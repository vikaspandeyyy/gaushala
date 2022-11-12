const router = require("express").Router();
const userController = require("../controllers/userController");
const passport = require("passport");
const hasPermissions = require("../utils/permissionChecker");

router.post("/", userController.addUser);
router.post("/login", userController.loginUser);
router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  userController.getUsers
);
router.post(
  "/search",
  passport.authenticate("user", { session: false }),
  userController.searchUsers
);
router.get(
  "/get/:id",
  passport.authenticate("user", { session: false }),
  userController.getUserById
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  userController.editUser
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  userController.deleteUser
);
router.post("/reset", userController.resetPassword);
router.post("/newpassword", userController.newPassword);

module.exports = router;
