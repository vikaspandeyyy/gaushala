const router = require("express").Router();

const passport = require("passport");
const productRouter = require("../controllers/productController");
const stockRouter = require("../controllers/stockController");
const hasPermissions = require("../utils/permissionChecker");

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  productRouter.addProduct
);

router.post(
  "/get",
  // passport.authenticate("user", { session: false }),
  productRouter.getProducts
);
router.get(
  "/get/:id",
  // passport.authenticate("user", { session: false }),
  productRouter.getProductsById
);
router.post(
  "/search",
  // passport.authenticate("user", { session: false }),
  productRouter.searchProducts
);
router.put(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  productRouter.editProduct
);
router.post(
  "/stock/add",
  passport.authenticate("user", { session: false }),
  // hasPermissions,
  stockRouter.addStocks
);
router.post(
  "/stock/byproduct/get",
  // passport.authenticate("user", { session: false }),
  // hasPermissions,
  stockRouter.getStockByProduct
);
router.get(
  "/stock/get/:id",
  passport.authenticate("user", { session: false }),
  // hasPermissions,
  stockRouter.getStockById
);
router.post(
  "/stock/qty",
  passport.authenticate("user", { session: false }),
  // hasPermissions,
  stockRouter.addStockValue
);
router.post(
  "/stock/create",
  passport.authenticate("user", { session: false }),
  // hasPermissions,
  stockRouter.createStocks
);
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  hasPermissions,
  productRouter.deleteProducts
);

router.post("/filter", productRouter.filterProducts);

module.exports = router;
