const Storefront = require("../models/storefrontModel");
const Media = require("../models/mediaModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const FlashSaleModel = require("../models/flashSaleModel");
const Tag = require("../models/tagModel");
const BrandModel = require("../models/brandModel");
const Page = require("../models/pageModel");
const SliderModel = require("../models/sliderModel");
const MenuModel = require("../models/menuModel");

exports.addStorefront = () => {
  const storefront = new Storefront({
    General: {
      WelcomeText: "Welcome to FleetCart store",
      ThemeColor: "Blue", 
      MailThemeColor: "Blue",
      Address: "Dhaka, Mohammadpur",
    },
    Menus: {
      NavbarText: "Free shipping over $100+",
      FooterMenuOneTitle: "Our Services",
      FooterMenuTwoTitle: "Information",
    },
    Footer: {
      FooterCopyrightText: `Copyright © Shrijeeshringar . All rights reserved.`,
    },
    Features: {
      SectionStatus: true,
      Features: [
        {
          Title: "24/7 SUPPORT",
          SubTitle: "Support every time",
          Icon: "las la-headphones",
        },
        {
          Title: "ACCEPT PAYMENT",
          SubTitle: "Visa, Paypal, Master",
          Icon: "las la-credit-card",
        },
        {
          Title: "SECURED PAYMENT",
          SubTitle: "100% secured",
          Icon: "las la-shield-alt",
        },
        {
          Title: "FREE SHIPPING",
          SubTitle: "Order over $100",
          Icon: "las la-truck",
        },
        {
          Title: "30 DAYS RETURN",
          SubTitle: "30 days guarantee",
          Icon: "las la-calendar-minus",
        },
      ],
    },
    ProductPage: {
      CalltoActionURL: "/categories/headphones/products",
      OpenInNewWindow: false,
    },
    SocialLinks: {
      Facebook: "#",
      Twitter: "#",
      Instagram: "#",
      Youtube: "#",
    },
    Banners: [
      {
        Name: "Slider Banners",
        Banners: [
          {
            CalltoActionURL: "/categories/backpacks/products",
            OpenInNewWindow: false,
          },
          {
            CalltoActionURL: "/categories/iphone/products",
            OpenInNewWindow: false,
          },
        ],
      },
      {
        Name: "Three Column Full Width Banners",
        Banners: [
          {
            CalltoActionURL: "/categories/home-appliances/products",
            OpenInNewWindow: false,
          },
          {
            CalltoActionURL: "/categories/home-appliances/products",
            OpenInNewWindow: false,
          },
          {
            CalltoActionURL: "/categories/samsung/products",
            OpenInNewWindow: false,
          },
        ],
      },
      {
        Name: "Two column banners",
        Banners: [
          {
            CalltoActionURL: "/categories/ultraslim/products",
            OpenInNewWindow: false,
          },
          {
            CalltoActionURL: "/categories/watches/products",
            OpenInNewWindow: false,
          },
        ],
      },
      {
        Name: "Three Column Banners",
        Banners: [
          {
            CalltoActionURL: "/categories/home-appliances/products",
            OpenInNewWindow: false,
          },
          {
            CalltoActionURL: "/categories/mobile-accessories/products",
            OpenInNewWindow: false,
          },
          {
            CalltoActionURL: "/categories/gadgets/products",
            OpenInNewWindow: false,
          },
        ],
      },
      {
        Name: "One Column Banner",
        Banners: [
          {
            CalltoActionURL: "/categories/home-appliances/products",
            OpenInNewWindow: true,
          },
        ],
      },
    ],
    FeaturedCategories: {
      SectionStatus: true,
      SectionTitle: "Top Categories in Sales and Trending",
      SectionSubtitle:
        "Last Month upto 1500+ Products Sales From this catagory. You can choose a product from here and save money.",
      Categories: [
        {
          Type: "Category Products",
        },
        {
          Type: "Category Products",
        },
        {
          Type: "Category Products",
        },
        {
          Type: "Category Products",
        },
        {
          Type: "Category Products",
        },
        {
          Type: "Category Products",
        },
      ],
    },
    Products: [
      {
        Name: "Product Tabs One",
        SectionStatus: true,
        Tabs: [
          {
            Title: "Featured",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "Special",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "New Arrival",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "Latest",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
        ],
      },
      {
        Name: "Product Grid",
        SectionStatus: true,
        Tabs: [
          {
            Title: "Mobiles",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "Fashion",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "Laptops",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "Tablets",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
        ],
      },
      {
        Name: "Product Tabs Two",
        SectionStatus: true,
        Title: "Hot Best Sellers",
        Tabs: [
          {
            Title: "Hot Best Sellers",
            Type: "Latest Products",
            ProductsLimit: 10,
          },
          {
            Title: "Recently Viewed",
            Type: "Recently Viewed Products",
            ProductsLimit: 10,
          },
          {
            Title: "Laptops",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
          {
            Title: "Top Selling",
            Type: "Latest Products",
            ProductsLimit: 100,
          },
        ],
      },
    ],
    TopBrands: {
      SectionStatus: true,
    },
    TopCategories: {
      SectionStatus: true,
    },
    FlashSaleVerticalProducts: {
      SectionStatus: true,
      Title: "Best <b>Deals</b>",
      VerticalProducts: [
        {
          Title: "Watches",
          Type: "Latest Products",
          ProductsLimit: 100,
        },
        {
          Title: "Backpacks",
          Type: "Latest Products",
          ProductsLimit: 100,
        },
        {
          Title: "Shirts",
          Type: "Latest Products",
          ProductsLimit: 100,
        },
      ],
    },
  });

  storefront
    .save()
    .then((addedStorefront) => {
      console.log(addedStorefront);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStorefront = (req, res) => {
  Storefront.find()
    .populate({
      path: "General",
      populate: [
        { path: "PrivacyPolicyPage" },
        { path: "TermsConditionsPage" },
        { path: "Slider" },
      ],
    })
    .populate({
      path: "Logo",
      populate: [
        { path: "Favicon" },
        { path: "HeaderLogo" },
        { path: "MailLogo" },
      ],
    })
    .populate({
      path: "Menus",
      populate: [
        { path: "PrimaryMenu" },
        { path: "CategoryMenu" },
        { path: "FooterMenuOne" },
        { path: "FooterMenuTwo" },
      ],
    })
    .populate({
      path: "Footer",
      populate: [
        { path: "FooterTags" },
        { path: "AcceptedPaymentMethodsImage" },
      ],
    })
    .populate({
      path: "Newsletter",
      populate: [{ path: "BackgroundImage" }],
    })
    .populate({
      path: "ProductPage",
      populate: [{ path: "Image" }],
    })
    .populate({
      path: "TopBrands",
      populate: [{ path: "TopBrands" }],
    })
    .populate({
      path: "TopCategories",
      populate: [{ path: "TopCategories" }],
    })
    .populate({
      path: "FlashSaleVerticalProducts",
      populate: [{ path: "VerticalProducts", populate: { path: "Category" } }],
    })
    .populate({
      path: "FeaturedCategories",
      populate: [
        {
          path: "Categories",
          populate: [{ path: "Category" }, { path: "Products" }],
        },
        { path: "ActiveCampaign" },
      ],
    })
    .populate({
      path: "Banners",
      populate: [
        { path: "Banners", populate: { path: "Image" } },
        { path: "Background" },
      ],
    })
    .populate({
      path: "Products",
      populate: [{ path: "Tabs", populate: { path: "Category" } }],
    })
    .then((storefront) => {
      res.status(200).json({
        success: true,
        data: storefront,
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

// exports.getStorefrontSelect = (req, res) = {
//   const  word  = req.body.word;

// }
const values = [
  "General",
  "Logo",
  "Menus",
  "Footer",
  "Newsletter",
  "Features",
  "ProductPage",
  "SocialLinks",
  "Banners",
  "FeaturedCategories",
  "Products",
  "TopBrands",
  "TopCategories",
  "FlashSaleVerticalProducts",
];

exports.getStorefrontSelect = (req, res) => {
  const { selectArray } = req.body;
  let selectString = "";
  values.forEach((value) => {
    if (!selectArray.includes(value)) {
      selectString += "-" + value + " ";
    }
  });

  console.log(selectString);

  Storefront.find()
    .populate({
      path: "General",
      populate: [
        { path: "PrivacyPolicyPage" },
        { path: "TermsConditionsPage" },
        { path: "Slider" },
      ],
    })
    .populate({
      path: "Logo",
      populate: [
        { path: "Favicon" },
        { path: "HeaderLogo" },
        { path: "MailLogo" },
      ],
    })
    .populate({
      path: "Menus",
      populate: [
        { path: "PrimaryMenu" },
        { path: "CategoryMenu" },
        { path: "FooterMenuOne" },
        { path: "FooterMenuTwo" },
      ],
    })
    .populate({
      path: "Footer",
      populate: [
        { path: "FooterTags" },
        { path: "AcceptedPaymentMethodsImage" },
      ],
    })
    .populate({
      path: "Newsletter",
      populate: [{ path: "BackgroundImage" }],
    })
    .populate({
      path: "ProductPage",
      populate: [{ path: "Image" }],
    })
    .populate({
      path: "TopBrands",
      populate: [{ path: "TopBrands" }],
    })
    .populate({
      path: "TopCategories",
      populate: [{ path: "TopCategories" }],
    })
    .populate({
      path: "FlashSaleVerticalProducts",
      populate: [{ path: "VerticalProducts", populate: { path: "Category" } }],
    })
    .populate({
      path: "FeaturedCategories",
      populate: [
        {
          path: "Categories",
          populate: [{ path: "Category" }, { path: "Products" }],
        },
        { path: "ActiveCampaign" },
      ],
    })
    .populate({
      path: "Banners",
      populate: [
        { path: "Banners", populate: { path: "Image" } },
        { path: "Background" },
      ],
    })
    .populate({
      path: "Products",
      populate: [
        {
          path: "Tabs",
          populate: [{ path: "Category" }, { path: "Products" }],
        },
      ],
    })
    .select(selectString)
    .then(async (storefront) => {
      if (selectArray.includes("Products")) {
        console.log(storefront[0]);
        const productsValues = storefront[0].Products.map(async (product) => {
          const tabArray = product.Tabs.map(async (tab) => {
            if (tab.Type === "Latest Products") {
              // console.log("YES");
              // console.log(tab);
              tab.Products = await ProductModel.find({ status: true })
                .sort("-createdAt")
                .limit(Number(tab.ProductsLimit));
              // console.log(tab.lastestProducts);
            } else if (tab.Type === "Category Products") {
              console.log("YES");
              // console.log(tab);
              if (tab.Category) console.log("Y");
              // console.log(tab.Category._id);
              try {
                if (tab.Category) {
                  tab.Products = await ProductModel.find({
                    categories: { $in: [tab.Category._id] },
                    status: true,
                  }).sort("-createdAt");
                }
              } catch (err) {
                console.log(err);
              }
              console.log(tab.Products);
              // console.log(tab.lastestProducts);
            }
            return tab;
          });
          const TABS = await Promise.all(tabArray);

          product.Tabs = TABS;
          return product;
        });
        storefront[0].Products = await Promise.all(productsValues);
      }

      if (selectArray.includes("FeaturedCategories")) {
        const fcValues = storefront[0].FeaturedCategories.Categories.map(
          async (category) => {
            if (category.Type === "Category Products") {
              try {
                if (category.Category) {
                  category.Products = await ProductModel.find({
                    categories: { $in: [category.Category._id] },
                    status: true,
                  }).sort("-createdAt");
                }
                // console.log(category.Products);
              } catch (err) {
                console.log(err);
              }
              // console.log(tab.Products);
              // console.log(tab.lastestProducts);
            }
            return category;
          }
        );

        storefront[0].FeaturedCategories.Categories = await Promise.all(
          fcValues
        );
      }
      res.status(200).json({
        success: true,
        data: storefront,
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

exports.editStorefront = async (req, res) => {
  let Slider;
  if (req.body.General.SliderId) {
    try {
      Slider = await SliderModel.findById(req.body.General.SliderId);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 1",
      });
    }
  }
  // if (!Slider) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find slider",
  //   });
  // }

  let TermsConditionsPage;
  if (req.body.General.TermsConditionsPageId) {
    try {
      TermsConditionsPage = await Page.findById(
        req.body.General.TermsConditionsPageId
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  }

  // if (!TermsConditionsPage) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find page",
  //   });
  // }

  let PrivacyPolicyPage;
  if (req.body.General.PrivacyPolicyPageId) {
    try {
      PrivacyPolicyPage = await Page.findById(
        req.body.General.PrivacyPolicyPageId
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 3",
      });
    }
  }

  // if (!PrivacyPolicyPage) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find page",
  //   });
  // }

  const General = {
    ...req.body.General,
    PrivacyPolicyPage,
    TermsConditionsPage,
    Slider,
  };

  let Favicon;
  if (req.body.Logo.FaviconId) {
    try {
      Favicon = await Media.findById(req.body.Logo.FaviconId);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 4",
      });
    }
  }

  // if (!Favicon) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find media 1",
  //   });
  // }

  let HeaderLogo;
  if (req.body.Logo.HeaderLogoId) {
    try {
      HeaderLogo = await Media.findById(req.body.Logo.HeaderLogoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 5",
      });
    }
  }

  // if (!HeaderLogo) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find media 2",
  //   });
  // }

  let MailLogo;
  if (req.body.Logo.MailLogoId) {
    try {
      MailLogo = await Media.findById(req.body.Logo.MailLogoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!MailLogo) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find media 3",
  //   });
  // }

  const Logo = {
    Favicon,
    HeaderLogo,
    MailLogo,
  };

  let PrimaryMenu;
  if (req.body.Menus.PrimaryMenuId) {
    try {
      PrimaryMenu = await MenuModel.findById(req.body.Menus.PrimaryMenuId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  let CategoryMenu;
  if (req.body.Menus.CategoryMenuId) {
    try {
      CategoryMenu = await MenuModel.findById(req.body.Menus.CategoryMenuId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  let FooterMenuOne;
  if (req.body.Menus.FooterMenuOneId) {
    try {
      FooterMenuOne = await MenuModel.findById(req.body.Menus.FooterMenuOneId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  let FooterMenuTwo;
  if (req.body.Menus.FooterMenuTwoId) {
    try {
      FooterMenuTwo = await MenuModel.findById(req.body.Menus.FooterMenuTwoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }
  const Menus = {
    ...req.body.Menus,
    PrimaryMenu,
    CategoryMenu,
    FooterMenuOne,
    FooterMenuTwo,
  };

  let FooterTags;
  if (req.body.Footer.FooterTagsIds) {
    try {
      FooterTags = await Tag.find({
        _id: { $in: req.body.Footer.FooterTagsIds },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  let AcceptedPaymentMethodsImage;
  if (req.body.Footer.AcceptedPaymentMethodsImageId) {
    try {
      AcceptedPaymentMethodsImage = await Media.findById(
        req.body.Footer.AcceptedPaymentMethodsImageId
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!AcceptedPaymentMethodsImage) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find media 4",
  //   });
  // }

  const Footer = {
    ...req.body.Footer,
    AcceptedPaymentMethodsImage,
    FooterTags,
  };

  let BackgroundImage;
  if (req.body.Newsletter.BackgroundImageId) {
    try {
      BackgroundImage = await Media.findById(
        req.body.Newsletter.BackgroundImageId
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!BackgroundImage) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find media 5",
  //   });
  // }

  const Newsletter = {
    BackgroundImage,
  };

  let ProductPageImage;
  if (req.body.ProductPage.ImageId) {
    try {
      ProductPageImage = await Media.findById(req.body.ProductPage.ImageId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!ProductPageImage) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Cannot find media 6",
  //   });
  // }

  const ProductPage = {
    ...req.body.ProductPage,
    Image: ProductPageImage,
  };

  const requiredBanners = req.body.Banners.map(async (banner) => {
    const requiredBanner = banner.Banners.map(async (b) => {
      let foundImage;
      if (b.ImageId) {
        try {
          foundImage = await Media.findById(b.ImageId);
        } catch (err) {
          return null;
        }
      }

      // if (!foundImage) {
      //   return null;
      // }

      const banners = {
        ...b,
        Image: foundImage,
      };
      return banners;
    });

    let Banner = await Promise.all(requiredBanner);

    Banner = Banner.filter((B) => B != null);

    let Background;
    if (banner.BackgroundId) {
      try {
        Background = await Media.findById(banner.BackgroundId);
      } catch (err) {
        return null;
      }
    }

    // if (!Background) {
    //   return res.status(422).json({
    //     success: false,
    //     message: "Cannot find media 7",
    //   });
    // }

    const banners = {
      ...banner,
      Banners: Banner,
      Background: Background,
    };

    return banners;
  });

  let Banners = await Promise.all(requiredBanners);
  Banners = Banners.filter((B) => B != null);

  const requiredCategories = req.body.FeaturedCategories.Categories.map(
    async (category) => {
      let foundCategory;
      if (category.CategoryId) {
        try {
          foundCategory = await CategoryModel.findById(category.CategoryId);
        } catch (err) {
          console.log(err);
          // return null;
        }

        // if (!foundCategory) {
        //   return null;
        // }
      }

      let foundProducts;
      if (category.ProductIds) {
        try {
          foundProducts = await ProductModel.find({
            _id: { $in: category.ProductIds },
          });
        } catch (err) {
          console.log(err);
          // return null;
        }
      }

      const Category = {
        ...category,
        Category: foundCategory,
        Products: foundProducts,
      };

      return Category;
    }
  );

  let Categories = await Promise.all(requiredCategories);
  Categories = Categories.filter((C) => C != null);

  const FeaturedCategories = {
    ...req.body.FeaturedCategories,
    Categories: Categories,
  };

  const requiredProducts = req.body.Products.map(async (product) => {
    const requiredTabs = product.Tabs.map(async (tab) => {
      let foundCategory;
      if (tab.CategoryId) {
        try {
          console.log(tab.CategoryId);
          foundCategory = await CategoryModel.findById(tab.CategoryId);
        } catch (err) {
          // return null;
        }
      }

      let foundProducts;
      if (tab.ProductIds) {
        try {
          // console.log(tab.CategoryId);
          foundProducts = await ProductModel.find({
            _id: { $in: tab.ProductIds },
          });
        } catch (err) {
          // return null;
        }
      }

      const Tab = {
        ...tab,
        Category: foundCategory,
        Products: foundProducts,
      };
      return Tab;
    });

    let Tabs = await Promise.all(requiredTabs);
    Tabs = Tabs.filter((T) => T != null);

    const Product = {
      ...product,
      Tabs: Tabs,
    };

    return Product;
  });

  let Products = await Promise.all(requiredProducts);
  Products = Products.filter((P) => P != null);

  let RequiredTopBrands;
  if (req.body.TopBrands.TopBrandsIds) {
    try {
      RequiredTopBrands = await BrandModel.find({
        _id: { $in: req.body.TopBrands.TopBrandsIds },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 9",
      });
    }
  }

  const TopBrands = {
    ...req.body.TopBrands,
    TopBrands: RequiredTopBrands,
  };

  let RequiredTopCategories;
  if (req.body.TopCategories && req.body.TopCategories.TopCategoriesIds) {
    try {
      RequiredTopCategories = await CategoryModel.find({
        _id: { $in: req.body.TopCategories.TopCategoriesIds },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 9",
      });
    }
  }

  const TopCategories = {
    ...req.body.TopCategories,
    TopCategories: RequiredTopCategories,
  };

  const requiredVerticalProducts =
    req.body.FlashSaleVerticalProducts.VerticalProducts.map(async (product) => {
      let foundCategory;
      if (product.CategoryId) {
        try {
          foundCategory = await CategoryModel.findById(product.CategoryId);
        } catch (err) {
          // return null;
        }

        // if (!foundCategory) {
        //   return null;
        // }
      }

      let foundProducts;
      if (product.ProductIds) {
        try {
          foundProducts = await ProductModel.find({
            _id: { $in: product.ProductIds },
          });
        } catch (err) {
          // return null;
        }
      }

      const Product = {
        ...product,
        Category: foundCategory,
        Products: foundProducts,
      };

      return Product;
    });

  let VerticalProducts = await Promise.all(requiredVerticalProducts);

  VerticalProducts = VerticalProducts.filter((V) => V != null);

  let ActiveCampaign;
  if (req.body.FlashSaleVerticalProducts.ActiveCampaignId) {
    try {
      ActiveCampaign = await FlashSaleModel.findById(
        req.body.FlashSaleVerticalProducts.ActiveCampaignId
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 6",
      });
    }
  }

  const FlashSaleVerticalProducts = {
    ...req.body.FlashSaleVerticalProducts,
    ActiveCampaign,
    VerticalProducts: VerticalProducts,
  };

  Storefront.findByIdAndUpdate(
    req.body._id,
    {
      General: General,
      Logo: Logo,
      Menus: Menus,
      Footer: Footer,
      Newsletter: Newsletter,
      Features: req.body.Features,
      ProductPage: ProductPage,
      SocialLinks: req.body.SocialLinks,
      Banners: Banners,
      FeaturedCategories: FeaturedCategories,
      Products: Products,
      TopBrands: TopBrands,
      TopCategories: TopCategories,
      FlashSaleVerticalProducts: FlashSaleVerticalProducts,
    },
    {
      new: true,
    }
  )
    .then((editedStorefront) => {
      return res.status(200).json({
        success: true,
        data: editedStorefront,
      });
    })
    .catch((err) => {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "something went wrong 7",
      });
    });
};
