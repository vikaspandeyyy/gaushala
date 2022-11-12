const Role = require("../models/roleModel");
const Setting = require("../models/settingModel");

exports.addSetting = () => {
  // const { SupportedCountries, DefaultCountry, SupportedLocales, DefaultLocale, DefaultTimezone, CustomerRole} = req.body.data.General;
  // const {StoreName, StoreEmail, StorePhone} = req.body.Store;
  // const {SupportedCurrencies, DefaultCurrency} = req.body.Currency;
  // const {SupportedCurrencies, DefaultCurrency} = req.body.Currency;

  const setting = new Setting({
    General: {
      SupportedCountries: ["Bangladesh", "United States"],
      DefaultCountry: "United States",
      SupportedLocales: ["Arabic", "English"],
      DefaultLocale: "English",
      DefaultTimezone: "UTC",
      RatingsAndReviews: true,
      AutoApproveReviews: false,
      CookieBar: true,
    },
    Maintenance: {
      MaintenanceMode: false,
    },
    Store: {
      StoreName: "FleetCart",
      StoreTagline: "",
      StoreEmail: "admin@email.com",
      StorePhone: "+990123456789",
      StoreAddress1: "Palli Bidyut, Savar",
      StoreAddress2: "",
      StoreCity: "Dhaka",
      StoreCountry: "Bangladesh",
      StoreState: "Dhaka",
      StoreZip: "1344",
      HideStorePhone: false,
      HideStoreEmail: false,
    },
    Currency: {
      SupportedCurrencies: ["Indian Rupee", "Saudi Riyal", "US Dollar"],
      DefaultCurrency: "US Dollar",
      ExchangeRateService: {
        name: "",
        APIKey: "",
      },
      AutoRefresh: {
        Enable: false,
        Frequency: "",
      },
    },
    SMS: {
      SMSFrom: "",
      SMSService: {
        name: "",
        API_KEY: "",
        APISecret: "",
      },
      WelcomeSMS: false,
      NewOrderAdminSMS: false,
      NewOrderSMS: false,
      SMSOrderStatuses: [],
    },
    Mail: {
      MailFromAddress: "customerservice@fleetcart.envaysoft.com",
      MailFromName: "Customer Service",
      MailHost: "",
      MailPort: "",
      MailUsername: "",
      MailPassword: "",
      MailEncryption: "",
      WelcomeEmail: false,
      NewOrderAdminEmail: false,
      InvoiceEmail: false,
      EmailOrderStatuses: [],
    },
    Newsletter: {
      Newsletter: false,
      MailchimpAPIkey: "",
      MailchimpListID: "",
    },
    CustomCSSJS: {
      Header: "",
      Footer: "",
    },
    SocialLogins: {
      Facebook: {
        Status: false,
        AppID: "",
        Appsecret: "",
      },
      Google: {
        Status: false,
        ClientID: "",
        ClientSecret: "",
      },
    },
    ShippingMethods: {
      FreeShipping: {
        Status: true,
        Label: "Free Shipping",
        MinimumAmount: "",
      },
      LocalPickup: {
        Status: true,
        Label: "Local Pickup",
        Cost: 20,
      },
      FlatRate: {
        Status: true,
        Label: "Flat Rate",
        Cost: 20,
      },
    },
    PaymentMethods: {
      Paypal: {
        Status: false,
        Label: "PayPal",
        Description: "Pay via your PayPal account.",
        Sandbox: false,
        ClientID: "",
        Secret: "",
      },
      Stripe: {
        Status: false,
        Label: "Stripe",
        Description: "Pay via credit or debit card.",
        PublishableKey: "",
        SecretKey: "",
      },
      Paytm: {
        Status: false,
        Label: "Paytm",
        Description:
          "The best payment gateway provider in India for e-payment through credit card, debit card & net banking.",
        Sandbox: false,
        MerchantID: "",
        MerchantKey: "",
      },
      Razorpay: {
        Status: false,
        Label: "Razorpay",
        Description:
          "Pay securely by Credit or Debit card or Internet Banking through Razorpay.",
        KeyID: "",
        KeySecret: "",
      },
      Instamojo: {
        Status: false,
        Label: "Instamojo",
        Description: "CC/DB/NB/Wallets",
        Sandbox: false,
        APIKey: "",
        AuthToken: "",
      },
      CashonDelivery: {
        Status: true,
        Label: "Cash On Delivery",
        Description: "Pay with cash upon delivery.",
      },
      BankTransfer: {
        Status: true,
        Label: "Bank Transfer",
        Description:
          "Make your payment directly into our bank account. Please use your Order ID as the payment reference.",
        Instructions: "",
      },
      ChequeMoneyOrder: {
        Status: true,
        Label: "Check / Money Order",
        Description: "Please send a check to our store.",
        Instructions: "",
      },
    },
  });
  console.log(setting);
  setting
    .save()
    .then((addedSetting) => {
      console.log(addedSetting);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSettingsSensitiveHidden = (req, res) => {
  Setting.find()
    .populate({ path: "General", populate: { path: "CustomerRole" } })
    .then((settings) => {
      settings[0].Currency.ExchangeRateService.API_Key = "*****";
      settings[0].SMS.SMSService.API_KEY = "*****";
      settings[0].SocialLogins.Facebook.AppID = "*****";
      settings[0].SocialLogins.Facebook.Appsecret = "*****";
      settings[0].SocialLogins.Google.ClientID = "*****";
      settings[0].SocialLogins.Google.ClientSecret = "*****";
      settings[0].PaymentMethods.Paypal.ClientID = "*****";
      settings[0].PaymentMethods.Paypal.Secret = "*****";
      settings[0].PaymentMethods.Stripe.PublishableKey = "*****";
      settings[0].PaymentMethods.Stripe.SecretKey = "*****";
      settings[0].PaymentMethods.Paytm.MerchantID = "*****";
      settings[0].PaymentMethods.Paytm.MerchantKey = "*****";
      settings[0].PaymentMethods.Razorpay.KeyID = "*****";
      settings[0].PaymentMethods.Razorpay.KeySecret = "*****";
      settings[0].PaymentMethods.Instamojo.APIKey = "*****";
      settings[0].PaymentMethods.Instamojo.AuthToken = "*****";
      settings[0].Newsletter.MailchimpAPIkey = "*****";
      res.status(200).json({
        success: true,
        data: settings,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
exports.getSettings = (req, res) => {
  Setting.find()
    .populate({ path: "General", populate: { path: "CustomerRole" } })
    .then((settings) => {
      res.status(200).json({
        success: true,
        data: settings,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.editSettings = async (req, res) => {
  const {
    SupportedCountries,
    DefaultCountry,
    SupportedLocales,
    DefaultLocale,
    DefaultTimezone,
    CustomerRoleId,
  } = req.body.data.General;
  const { StoreName, StoreEmail, StorePhone } = req.body.data.Store;
  const { SupportedCurrencies, DefaultCurrency } = req.body.data.Currency;
  const { Facebook, Google } = req.body.data.SocialLogins;
  const {
    Paypal,
    Stripe,
    Paytm,
    Razorpay,
    Instamojo,
    CashonDelivery,
    BankTransfer,
    ChequeMoneyOrder,
  } = req.body.data.PaymentMethods;

  if (
    !SupportedCountries ||
    !DefaultCountry ||
    !SupportedLocales ||
    !DefaultLocale ||
    !DefaultTimezone ||
    !CustomerRoleId ||
    !StoreName ||
    !StoreEmail ||
    !StorePhone ||
    !SupportedCurrencies ||
    !DefaultCurrency
  ) {
    return res.status(422).json({
      success: false,
      message: `Please fill all the required fields`,
    });
  }

  if (
    (Facebook.Status && (!Facebook.AppID || !Facebook.Appsecret)) ||
    (Google.Status && (!Google.ClientID || !Google.ClientSecret)) ||
    (Paypal.Status && (!Paypal.ClientID || !Paypal.Secret)) ||
    (Stripe.Status && (!Stripe.PublishableKey || !SecretKey)) ||
    (Paytm.Status && (!Paytm.MerchantID || !MerchantKey)) ||
    (Razorpay.Status && (!Razorpay.KeyID || !Razorpay.KeySecret)) ||
    (Instamojo.Status && (!Instamojo.APIKey || !Instamojo.AuthToken))
  ) {
    return res.status(422).json({
      success: false,
      message: `Please fill all the required fields`,
    });
  }

  let CustomerRole;
  try {
    CustomerRole = await Role.findById(CustomerRoleId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (!CustomerRole) {
    return res.status(500).json({
      success: false,
      message: "Role not found",
    });
  }

  Setting.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
      General: {
        ...req.body.data.General,
        CustomerRole: CustomerRole,
      },
    },
    {
      new: true,
    }
  )
    .then((editedSetting) => {
      console.log(editedSetting);
      return res.status(200).json({
        success: true,
        data: editedSetting,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
