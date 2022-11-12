const fs = require("fs");

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const keys = require("./config/keys");
const http = require("http").Server(app);
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
// var findOrCreate = require("mongoose-findorcreate");
// const dotenv = require("dotenv");

require("./config/passport-setup");
require("./config/passport-facebook");
require("./config/razorpay-setup");

const authRouter = require("./src/router/authRouter");
const userRouter = require("./src/router/userRouter");
const roleRouter = require("./src/router/roleRouter");

const productRouter = require("./src/router/productRouter");
const brandRouter = require("./src/router/brandRouter");
const tagRouter = require("./src/router/tagRouter");
const attributeSetRouter = require("./src/router/attributeSetRouter");
const optionRouter = require("./src/router/optionRouter");
const attributeRouter = require("./src/router/attributeRouter");
const reviewRouter = require("./src/router/reviewRouter");
const categoryRouter = require("./src/router/categoryRouter");

const flashSaleRouter = require("./src/router/flashRouter");
const couponRouter = require("./src/router/couponRouter");
const pageRouter = require("./src/router/pageRouter");
const mediaRouter = require("./src/router/mediaRouter");
const dashBoardRouter = require("./src/router/dashBoardRouter");
const menuRouter = require("./src/router/menuRouter");

const slidesRouter = require("./src/router/slideRouter");
const storefrontRouter = require("./src/router/storefrontRouter");

const importRouter = require("./src/router/importerRouter");
const settingRouter = require("./src/router/settingRouter");
const reportRouter = require("./src/router/reportRouter");

const taxRouter = require("./src/router/taxRouter2");
const currencyRatesRouter = require("./src/router/currencyRatesRouter");

const orderRouter = require("./src/router/orderRouter");
const transactionRouter = require("./src/router/transactionRouter");

const customerRouter = require("./src/router/customerRouter");
const blogRouter = require("./src/router/blogRouter");

const razorpayRouter = require("./src/router/razorpayController");
const paypalRouter = require("./src/router/paypalRouter");
const stripeRouter = require("./src/router/stripeRouter");
const queryRouter = require("./src/router/queryRouter");
const complaintRouter = require("./src/router/complaintRouter");
const bannerRouter = require("./src/router/bannerRouter");

var path = require("path");
const { addSetting } = require("./src/controllers/settingController");
const { addStorefront } = require("./src/controllers/storefrontController");
const {
  createAdminRole,
  createCustomerRole,
} = require("./src/controllers/roleController");
const { createAdminUser } = require("./src/controllers/userController");

app.use(cors());

require("./config/passport")(passport);

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use(
  cookieSession({
    name: "cms-ecommerce",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads/media", express.static(path.join("uploads", "media")));
app.use(
  "/uploads/documents",
  express.static(path.join("uploads", "documents"))
);
app.use("/uploads/invoice", express.static(path.join("uploads", "invoice")));

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

morgan("tiny");
mongoose.set("useCreateIndex", true);

// app.use(express.static(path.join(__dirname, "src/documents")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: "api running",
  });
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);

app.use("/product", productRouter);
app.use("/brand", brandRouter);
app.use("/tag", tagRouter);
app.use("/attributeset", attributeSetRouter);
app.use("/option", optionRouter);
app.use("/attribute", attributeRouter);
app.use("/review", reviewRouter);
app.use("/category", categoryRouter);

app.use("/flashsale", flashSaleRouter);
app.use("/coupon", couponRouter);
app.use("/page", pageRouter);
app.use("/media", mediaRouter);
app.use("/dashboard", dashBoardRouter);
app.use("/menu", menuRouter);

app.use("/slides", slidesRouter);
app.use("/storefront", storefrontRouter);

app.use("/import", importRouter);
app.use("/settings", settingRouter);
app.use("/report", reportRouter);

app.use("/tax", taxRouter);
app.use("/currency", currencyRatesRouter);

app.use("/order", orderRouter);
app.use("/transaction", transactionRouter);

app.use("/customer", customerRouter);
app.use("/blog", blogRouter);
app.use("/razorpay", razorpayRouter);
app.use("/paypal", paypalRouter);
app.use("/stripe", stripeRouter);
app.use("/query", queryRouter);
app.use("/complaint", complaintRouter);
app.use("/banner", bannerRouter);

const port = process.env.PORT || 5000;

// addSetting();
// addStorefront();
// createAdminRole();
// createCustomerRole();
// createAdminUser();

http.listen(port, () => console.log("Listening"));
