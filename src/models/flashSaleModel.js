const mongoose = require("mongoose");

const flashSaleSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
      required: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"product",
          require: true,
        },
        endDate: {
          type: Date,
          require: true,
        },
        price: {
          type: String,
          require: true,
        },
        quantity: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = FlashSale = mongoose.model("flashSale", flashSaleSchema);
