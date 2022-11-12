const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    "First Name": {
      type: String,
      // required: true,
    },
    "Last Name": {
      type: String,
      // required: true,
    },
    Email: {
      type: String,
      // required: true,
    },
    LastLogin: {
      type: Date,
    },
    Phone: {
      type: String,
    },
    Password: {
      type: String,
      // required: true,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    token: {
      type: String,
    },
    Roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
      },
    ],
    Orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],

    Permissions: [
      {
        name: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    ],
    Wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    Cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "stock",
        },
        qty: {
          type: Number,
        },
      },
    ],
    Address: [
      {
        Country: {
          type: String,
        },
        AddressLine1: {
          type: String,
        },
        AddressLine2: {
          type: String,
        },
        State: {
          type: String,
        },
        City: {
          type: String,
        },
        Pin: {
          type: String,
        },
      },
    ],
    resetToken: {
      type: String,
    },
    expireToken: {
      type: Date,
    },
    // "Activated": {
    //     type: Boolean,
    //     required: true,

    // },
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("Roles");
  this.populate("Orders");
  this.populate("Wishlist");
  // this.populate({ path: "Cart", populate: { path: "product" } });
  this.populate({
    path: "Cart",
    populate: [{ path: "product" }, { path: "stock" }],
  });
  next();
}

userSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = User = mongoose.model("users", userSchema);
