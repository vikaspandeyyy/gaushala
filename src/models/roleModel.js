const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    Name: {
      type: String,
      required: true,
      unique: true,
    },
    //   Created: {
    //     type: String,
    //     required: true,
    //   },

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
  },
  { timestamps: true }
);

module.exports = Role = mongoose.model("roles", roleSchema);
