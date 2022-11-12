const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    sectionstatus: {
      type: Boolean,
    },
    body: {
      type: String,
    },
    banners: [
      {
        img: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "media",
        },
        smallimg: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "media",
        },
        title: {
          type: String,
        },
        body: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = Banner = mongoose.model("banner", bannerSchema);
