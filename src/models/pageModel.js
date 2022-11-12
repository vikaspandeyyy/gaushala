const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
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
    body: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = Page = mongoose.model("page", pageSchema);
