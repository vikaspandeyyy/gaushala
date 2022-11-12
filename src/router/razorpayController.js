const router = require("express").Router();
const keys = require("../../config/keys");
const crypto = require("crypto");
// const { instance } = require("../../config/razorpay-setup");
const initRazorpay = require("../../config/razorpay-setup");

initRazorpay()
  .then((instance) => {
    //console.log("Razorpay Working");

    router.get("/payment", (req, res) => {
      res.json({ payment: keys.RAZORPAY_KEY_ID });
    });

    router.post("/payment/order", (req, res) => {
      const params = req.body;

      instance.orders
        .create(params)
        .then((data) => {
          res.status(200).json({ success: true, data: data });
        })
        .catch((err) => {
          res.status(500).json({ success: false, message: "failed" });
        });
    });

    router.post("/payment/verify", (req, res) => {
      const body = req.body.RazorpayOrderId + "|" + req.body.RazorpayPaymentId;

      let expectedSignature = crypto
        .createHmac("sha256", keys.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      // console.log("sig" + req.body.RazorpaySignature);
      // console.log("sig" + expectedSignature);
      if (expectedSignature === req.body.RazorpaySignature) {
        return res.status(200).json({ status: true, message: "success!" });
      }
      return res.status(500).json({ status: false, message: "failure!" });
    });
  })
  .catch((err) => {
    // console.log(err);
    console.log("Couldn't connect to Razorpay");
  });

module.exports = router;
