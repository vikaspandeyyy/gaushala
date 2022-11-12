const crypto = require("crypto");
const keys = require("./keys");
const Razorpay = require("razorpay");
const Setting = require("../src/models/settingModel");

const getKeysFromSettings = async (type, name, key) => {
  let data;
  try {
    data = await Setting.find({});
  } catch (err) {
    console.log(err);
  }
  // console.log(data[0][type]["Google"]["ClientID"]);
  return data[0][type][name][key];
};

module.exports = async function () {
  var clientid = await getKeysFromSettings(
    "PaymentMethods",
    "Razorpay",
    "KeyID"
  );
  var clientSecret = await getKeysFromSettings(
    "PaymentMethods",
    "Razorpay",
    "KeySecret"
  );
  console.log(clientid);
  console.log(clientSecret);
  // paypal.configure({
  //   mode: "sandbox", //sandbox or live
  //   client_id: clientid,
  //   client_secret: clientSecret,
  // });

  return (instance = new Razorpay({
    key_id: clientid,
    key_secret: clientSecret,
  }));
};
