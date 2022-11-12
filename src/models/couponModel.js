const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
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
    code: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
    },
    value: {
      type: Number,
    },
    freeshipping: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    usageLimitPerCoupon: {
      type: Number,
    },
    minimumSpend: {
      type: Number,
    },
    maximumSpend: {
      type: Number,
    },
    usageLimitPerCustomer: {
      type: Number,
    },
    usedCoupon: {
      type: Number,
      default: 0,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    excludedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    // ID: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = Coupon = mongoose.model("coupon", couponsSchema);
