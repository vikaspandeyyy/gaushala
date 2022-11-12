const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    status: {
      type: Boolean,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = Review = mongoose.model("review", reviewSchema);
