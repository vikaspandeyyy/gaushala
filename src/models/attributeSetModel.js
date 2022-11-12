const mongoose = require("mongoose");

const attributeSetSchema = new mongoose.Schema(
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
      unique: true,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = AttributeSet = mongoose.model(
  "attributeSet",
  attributeSetSchema
);
