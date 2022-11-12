const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    qty: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

function autoPopulateSubs(next) {
  this.populate("product");
  next();
}

stockSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = Stock = mongoose.model("stock", stockSchema);
