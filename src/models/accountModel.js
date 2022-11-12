const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    // "First Name": {
    //   type: String,
    //   required: true,
    // },
    // "Last Name": {
    //   type: String,
    //   required: true,
    // },
    Username: {
      type: String,
    },
    Phone: {
      type: String,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    Address: [
      {
        type: String,
      },
    ],
    Orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  { timestamps: true }
);

module.exports = Account = mongoose.model("account", accountSchema);
