const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
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
    status: {
      type: Boolean,
    },
    menuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menuItem",
      },
    ],
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("menuItems");
  next();
}

menuSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);


module.exports = Menu = mongoose.model("menu", menuSchema);
