const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    banner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    status: {
      type: Boolean,
      default: false,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
  },
  { timestamps: true }
);
// brandSchema.index({ name : 1 });

function autoPopulateSubs(next) {
  this.populate("banner");
  this.populate("logo");
  next();
}

brandSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = Brand = mongoose.model("brand", brandSchema);
