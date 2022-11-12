const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
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
    // ID: {
    //   type: String,
    //   required: true,
    // },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Tag = mongoose.model("tag", tagSchema);
