const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    baseImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    additionalImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    downloads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    taxClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taxes2",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag",
      },
    ],
    virtual: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
    price: {
      type: Number,
      required: true,
    },
    specialPrice: {
      type: Number,
    },
    specialPriceType: {
      type: String,
    },
    specialPriceStart: {
      type: Date,
    },
    specialPriceEnd: {
      type: Date,
    },
    description: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
    },
    inventoryManagement: {
      type: Boolean,
    },
    Qty: {
      type: Number,
    },
    OrderedQty: {
      type: Number,
    },
    stockAvailability: {
      type: Boolean,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    attributes: [
      {
        attribute: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "attribute",
        },
        value: [
          {
            type: String,
          },
        ],
      },
    ],
    options: [
      {
        name: {
          type: String,
        },
        type: {
          type: String,
        },
        required: {
          type: Boolean,
        },
        value: [
          {
            label: {
              type: String,
            },
            price: {
              type: Number,
            },
            priceType: {
              type: String,
            },
          },
        ],
      },
    ],
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    upSells: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    crossSells: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    shortDescription: {
      type: String,
    },
    productNewFrom: {
      type: Date,
    },
    productNewTo: {
      type: Date,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("baseImage");
  this.populate("additionalImages");
  this.populate("attributes");
  this.populate("tags");
  this.populate("downloads");
  this.populate("categories");
  this.populate("brand");
  this.populate("taxClass");
  next();
}

productSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = Product = mongoose.model("product", productSchema);
