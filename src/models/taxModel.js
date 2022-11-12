const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
      required: true,
    },
    taxClass: {
      type: String,
      required: true,
    },
    basedOn: {
      type: String,
      required: true,
    },
    rates: [
      {
        name: {
          type: String,
        },
        country: {
          type: String,
        },
        state: {
          type: String,
        },
        city: {
          type: String,
        },
        zip: {
          type: String,
        },
        rate: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = Tax = mongoose.model("taxes", taxSchema);
