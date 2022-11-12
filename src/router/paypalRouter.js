const router = require("express").Router();
const paypal = require("paypal-rest-sdk");
let initPayPal = require("../../config/paypal-setup");

initPayPal()
  .then(() => {
    //console.log("PayPal Working");

    router.post("/pay", (req, res) => {
      const { items, currency, total, description } = req.body;

      // const items = [
      //   {
      //     name: "Red Sox Hat",
      //     sku: "001",
      //     price: "25.00",
      //     currency: "USD",
      //     quantity: 1,
      //   },
      // ];
      // const currency = "USD";
      // const total = "25.00";
      // const description = "Hello";
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:5000/paypal/success",
          cancel_url: "http://localhost:5000/paypal/cancel",
        },
        transactions: [
          {
            item_list: {
              items: items,
            },
            amount: {
              currency: currency,
              total: total,
            },
            description: description,
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
    });

    router.get("/success", (req, res) => {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
      const { currency, total } = req.body;
      // const currency = "USD";
      // const total = "25.00";

      // console.log(req.body, "BODY");
      // console.log("");
      // console.log("");
      // console.log("");
      // console.log("");
      // console.log(req.query, "QUERY");
      // console.log("");
      // console.log("");
      // console.log("");
      // console.log("");
      // console.log(req);
      // console.log("");
      // console.log("");
      // console.log("");
      // console.log("");

      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency,
              total,
            },
          },
        ],
      };

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            //console.log(JSON.stringify(payment));
            res.status(422).json({ message: "Success", payment: payment });
          }
        }
      );
    });

    router.get("/cancel", (req, res) =>
      res.status(422).json({ message: "Cancelled" })
    );
  })
  .catch((err) => {
    //console.log(err);
    console.log("Couldn't connect to PayPal");
  });
module.exports = router;
