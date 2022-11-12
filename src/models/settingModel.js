const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  General: {
    SupportedCountries: [
      {
        type: String,
      },
    ],
    DefaultCountry: {
      type: String,
    },
    SupportedLocales: [
      {
        type: String,
      },
    ],
    DefaultLocale: {
      type: String,
    },
    DefaultTimezone: {
      type: String,
    },
    CustomerRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
    },
    RatingsAndReviews: {
      type: Boolean,
    },
    AutoApproveReviews: {
      type: Boolean,
    },
    CookieBar: {
      type: Boolean,
    },
  },
  Maintenance: {
    MaintenanceMode: {
      type: Boolean,
    },
  },
  Store: {
    StoreName: {
      type: String,
    },
    StoreTagline: {
      type: String,
    },
    StoreEmail: {
      type: String,
    },
    StorePhone: {
      type: String,
    },
    StoreAddress1: {
      type: String,
    },
    StoreAddress2: {
      type: String,
    },
    StoreCity: {
      type: String,
    },
    StoreCountry: {
      type: String,
    },
    StoreState: {
      type: String,
    },
    StoreZip: {
      type: String,
    },
    HideStorePhone: {
      type: Boolean,
    },
    HideStoreEmail: {
      type: Boolean,
    },
  },
  Currency: {
    SupportedCurrencies: [
      {
        type: String,
      },
    ],
    DefaultCurrency: {
      type: String,
    },
    ExchangeRateService: {
      name: {
        type: String,
      },
      API_Key: {
        type: String,
      },
    },
    AutoRefresh: {
      Enable: {
        type: Boolean,
      },
      Frequency: {
        type: String,
      },
    },
  },
  SMS: {
    SMSFrom: {
      type: String,
    },
    SMSService: {
      name: {
        type: String,
      },
      API_KEY: {
        type: String,
      },
      APISecret: {
        type: String,
      },
    },
    WelcomeSMS: {
      type: Boolean,
    },
    NewOrderAdminSMS: {
      type: Boolean,
    },
    NewOrderSMS: {
      type: Boolean,
    },
    SMSOrderStatuses: [
      {
        type: String,
      },
    ],
  },
  Mail: {
    MailFromAddress: {
      type: String,
    },
    MailFromName: {
      type: String,
    },
    MailHost: {
      type: String,
    },
    MailPort: {
      type: String,
    },
    MailUsername: {
      type: String,
    },
    MailPassword: {
      type: String,
    },
    MailEncryption: {
      type: String,
    },
    WelcomeEmail: {
      type: Boolean,
    },
    NewOrderAdminEmail: {
      type: Boolean,
    },
    InvoiceEmail: {
      type: Boolean,
    },
    EmailOrderStatuses: [
      {
        type: String,
      },
    ],
  },
  Newsletter: {
    Newsletter: {
      type: Boolean,
    },
    MailchimpAPIkey: {
      type: String,
    },
    MailchimpListID: {
      type: String,
    },
  },
  CustomCSSJS: {
    Header: {
      type: String,
    },
    Footer: {
      type: String,
    },
  },
  SocialLogins: {
    Facebook: {
      Status: {
        type: Boolean,
      },
      AppID: {
        type: String,
      },
      Appsecret: {
        type: String,
      },
      CallBackUrl: {
        type: String,
      },
    },
    Google: {
      Status: {
        type: Boolean,
      },
      ClientID: {
        type: String,
      },
      ClientSecret: {
        type: String,
      },
      CallBackUrl: {
        type: String,
      },
    },
  },
  ShippingMethods: {
    FreeShipping: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      MinimumAmount: {
        type: Number,
      },
    },
    LocalPickup: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Cost: {
        type: Number,
      },
    },
    FlatRate: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Cost: {
        type: Number,
      },
    },
  },
  PaymentMethods: {
    Paypal: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      Sandbox: {
        type: Boolean,
      },
      ClientID: {
        type: String,
      },
      Secret: {
        type: String,
      },
    },
    Stripe: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      PublishableKey: {
        type: String,
      },
      SecretKey: {
        type: String,
      },
    },
    Paytm: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      Sandbox: {
        type: Boolean,
      },
      MerchantID: {
        type: String,
      },
      MerchantKey: {
        type: String,
      },
    },
    Razorpay: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      KeyID: {
        type: String,
      },
      KeySecret: {
        type: String,
      },
    },
    Instamojo: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      Sandbox: {
        type: Boolean,
      },
      APIKey: {
        type: String,
      },
      AuthToken: {
        type: String,
      },
    },
    CashonDelivery: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
    },
    BankTransfer: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      Instructions: {
        type: String,
      },
    },
    ChequeMoneyOrder: {
      Status: {
        type: Boolean,
      },
      Label: {
        type: String,
      },
      Description: {
        type: String,
      },
      Instructions: {
        type: String,
      },
    },
  },
});

module.exports = Settings = mongoose.model("settings", settingsSchema);
