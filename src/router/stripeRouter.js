const router = require("express").Router();
const keys = require("../../config/keys");
const Publishable_Key = keys.STRIPE_PUBLISHABLE_KEY;
const Secret_Key = keys.STRIPE_SECRET_KEY;

const stripe = require("stripe")(Secret_Key);

router.get("/key", function (req, res) {
  res.json({
    key: Publishable_Key,
  });
});

router.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: req.body.stripeName,
      address: req.body.address,
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: req.body.amount, // Charing Rs 25
        description: req.body.description,
        currency: req.body.currency,
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.json({ message: "Success" }); // If no error occurs
    })
    .catch((err) => {
    //   res.send(err); // If some error occurs
      res.json({ message: "Error", error: err });
    });
});

module.exports = router;
