const paypal = require("paypal-rest-sdk");
const keys = require("./keys");
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
    "Paypal",
    "ClientID"
  );
  var clientSecret = await getKeysFromSettings(
    "PaymentMethods",
    "Paypal",
    "Secret"
  );
  console.log(clientid);
  console.log(clientSecret);
  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: clientid,
    client_secret: clientSecret,
  });
};
