const mongoose = require("mongoose");

const optionsSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
    values: [
      {
        label: {
          type: String,
        },
        price: {
          type: String,
        },
        priceType: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = Option = mongoose.model("option", optionsSchema);
