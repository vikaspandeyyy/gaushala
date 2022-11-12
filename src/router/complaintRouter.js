const router = require("express").Router();

const passport = require("passport");
const complaintController = require("../controllers/complaintController");
const fileUpload = require("../middlewares/fileUpload");

const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  //   hasPermissions,
  fileUpload.array("image", 10),
  complaintController.addComplaint
);

router.post(
  "/get",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  complaintController.getComplaints
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  complaintController.getComplaintById
);
router.get(
  "/getByUser/:id",
  // passport.authenticate("user", { session: false }),
  complaintController.getComplaintUser
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  complaintController.editComplaint
);

// router.delete(
//   "/",
//   passport.authenticate("user", { session: false }),
//   hasPermissions,
//   complaintController.deleteProducts
// );

// router.post("/filter", complaintController.filterProducts);

module.exports = router;
