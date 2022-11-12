const mongoose = require("mongoose");

const storefrontSchema = new mongoose.Schema({
  General: {
    WelcomeText: {
      type: String,
    },
    ThemeColor: {
      type: String,
    },
    MailThemeColor: { 
      type: String,
    },
    Slider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "slider",
    },
    TermsConditionsPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
    },
    PrivacyPolicyPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
    },
    Address: {
      type: String,
    },
  },
  Logo: {
    Favicon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    HeaderLogo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    MailLogo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
  },
  Menus: {
    NavbarText: {
      type: String,
    },
    PrimaryMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menu",
    },
    CategoryMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menu",
    },
    FooterMenuOneTitle: {
      type: String,
    },
    FooterMenuOne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menu",
    },
    FooterMenuTwoTitle: {
      type: String,
    },
    FooterMenuTwo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menu",
    },
  },
  Footer: {
    FooterTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag",
      },
    ],
    FooterCopyrightText: {
      type: String,
    },
    AcceptedPaymentMethodsImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
  },
  Newsletter: {
    BackgroundImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
  },
  Features: {
    SectionStatus: {
      type: Boolean,
    },
    Features: [
      {
        Title: {
          type: String,
        },
        SubTitle: {
          type: String,
        },
        Icon: {
          type: String,
        },
      },
    ],
  },
  ProductPage: {
    CalltoActionURL: {
      type: String,
    },
    Image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    OpenInNewWindow: {
      type: Boolean,
    },
  },
  SocialLinks: {
    Facebook: {
      type: String,
    },
    Twitter: {
      type: String,
    },
    Instagram: {
      type: String,
    },
    Youtube: {
      type: String,
    },
  },
  Banners: [
    {
      Name: {
        type: String,
      },
      SectionStatus: {
        type: Boolean,
      },
      Background: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "media",
      },
      Banners: [
        {
          CalltoActionURL: {
            type: String,
          },
          Image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "media",
          },
          OpenInNewWindow: {
            type: Boolean,
          },
        },
      ],
    },
  ],
  FeaturedCategories: {
    SectionStatus: {
      type: String,
    },
    SectionTitle: {
      type: String,
    },
    SectionSubtitle: {
      type: String,
    },
    Categories: [
      {
        Category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "category",
        },
        Type: {
          type: String,
        },
        Products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
        ],
      },
    ],
  },
  Products: [
    {
      Name: {
        type: String,
      },
      SectionStatus: {
        type: Boolean,
      },
      Title: {
        type: String,
      },
      Tabs: [
        {
          Title: {
            type: String,
          },
          Category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
          },
          Type: {
            type: String,
          },
          Products: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "product",
            },
          ],
          ProductsLimit: {
            type: String,
          },
        },
      ],
    },
  ],
  TopBrands: {
    SectionStatus: {
      type: Boolean,
    },
    TopBrands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
      },
    ],
  },
  TopCategories: {
    SectionStatus: {
      type: Boolean,
    },
    TopCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
  },
  FlashSaleVerticalProducts: {
    SectionStatus: {
      type: Boolean,
    },
    Title: {
      type: String,
    },
    ActiveCampaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "flashsale",
    },
    VerticalProducts: [
      {
        Title: {
          type: String,
        },
        Category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "category",
        },
        Type: {
          type: String,
        },
        Products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
        ],
        ProductsLimit: {
          type: String,
        },
      },
    ],
  },
});

function autoPopulateSubs(next) {
  this.populate({
    path: "Logo",
    populate: [
      { path: "Favicon" },
      { path: "HeaderLogo" },
      { path: "MailLogo" },
    ],
  });
  next();
}

storefrontSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);
module.exports = Storefront = mongoose.model("storefront", storefrontSchema);
