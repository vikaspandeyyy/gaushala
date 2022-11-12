const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
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
    attributeSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "attributeSet",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    filterable: {
      type: Boolean,
    },
    value: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("attributeSet");
  this.populate("categories");;
  next();
}

attributeSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = Attribute = mongoose.model("attribute", attributeSchema);
