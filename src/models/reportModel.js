const mongoose = require("mongoose");

const storefrontSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  ReportData: {
    TableHeads: [
      {
        type: String,
      },
    ],
    TableValues: [
      {
        type: String,
      },
    ],
  },
});

module.exports = Storefront = mongoose.model("storefronts", storefrontSchema);
