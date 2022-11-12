const Setting = require("../models/settingModel");

exports.getKeysFromSettings = async (type, name, key) => {
  let data;
  try {
    data = await Setting.find({});
  } catch (err) {
    console.log(err);
  }
  // console.log(data[0]["SocialLogins"]["Google"]["ClientID"]);
  return data[0][type][name][key];
};

// can be called by using: await getSettings('PaymentMethods','Paypal','Label') anywhere from the app
