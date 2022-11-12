const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Code: {
      type: String,
    },
    Rate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Currency = mongoose.model("currency", currencySchema);
