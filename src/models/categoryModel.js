const mongoose = require("mongoose");
// const slugify = require("../utils/slugFunction");

const categorySchema = new mongoose.Schema(
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
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
    searchable: {
      type: Boolean,
    },
    status: {
      type: Boolean,
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
    childrenCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    categoryType: {
      type: String,
      enum: ["Root", "SubCategory"],
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("childrenCategory");
  this.populate("logo");
  this.populate("banner");
  next();
}

categorySchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = Category = mongoose.model("category", categorySchema);
