const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
      required: true,
    },
    FullName: {
      type: String,
    },
    Email: {
      type: String,
    },
    Phone: {
      type: String,
    },
    Read: {
      type: String,
      default: false,
    },
    // OrderId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "order",
    // },
    // Image: {
    //   type: String,
    // },
    Country: {
      type: String,
    },
    Subject: {
      type: String,
    },
    Body: {
      type: String,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = Query = mongoose.model("query", querySchema);
