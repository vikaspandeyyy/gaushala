const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    Order_id: {
      type: String,
      required: true,
    },
    OrderID: {
      type: Number,
      required: true,
    },
    PaymentMethod: {
      type: String,
      required: true,
    },
    // TransactionId:{
    //   type: String
    // }
  },
  { timestamps: true }
);

module.exports = Transaction = mongoose.model("transaction", transactionSchema);
