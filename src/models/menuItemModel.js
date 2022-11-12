const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menu",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
    },
    MENUTYPE: {
      type: String,
      enum: ["Root", "SubMenuItem"],
    },
    parentMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuItem",
    },
    childrenMenu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menuItem",
      },
    ],
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media",
    },
    url: {
      type: String,
    },
    icon: {
      type: String,
    },
    target: {
      type: String,
    },
    fluidMenu: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("childrenMenu");
  this.populate("category");
  this.populate("page");
  this.populate("image");
  next();
}

menuItemSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = MenuItem = mongoose.model("menuItem", menuItemSchema);
