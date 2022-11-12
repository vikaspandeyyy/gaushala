const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
      // unique: true,
    },
    img: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    metaTitle: {
      type: String,
      // required: true,
    },
    metaDescription: {
      type: String,
      // required: true,
      // unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = Blog = mongoose.model("blog", blogSchema);
