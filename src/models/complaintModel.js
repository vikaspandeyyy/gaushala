const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    Email: {
      type: String,
    },
    Phone: {
      type: String,
    },
    Read: {
      type: String,
      default: false,
    },
    OrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    Image: {
      type: Array,
    },
    Country: {
      type: String,
    },
    Subject: {
      type: String,
    },
    Body: {
      type: String,
    },
    // ID: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = Complaint = mongoose.model("complaint", complaintSchema);
