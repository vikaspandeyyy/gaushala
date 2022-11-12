const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    Status: {
      type: String,
      required: true,
    },
    Reciever: {
      type: String,
    },
    Email: {
      type: String,
    },
    Phone: {
      type: String,
    },
    ShippingMethod: {
      type: String,
      required: true,
    },
    Currency: {
      type: mongoose.Schema.Types.ObjectId,
    },
    PaymentMethod: {
      type: String,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    Address: {
      BillingAddress: {
        Name: {
          type: String,
        },
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
      ShippingAddress: {
        Name: {
          type: String,
        },
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
    },
    ItemsOrdered: [
      {
        Product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          require: true,
        },
        Stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "stock",
        },
        UnitPrice: {
          type: Number,
          require: true,
        },
        Quantity: {
          type: Number,
          require: true,
        },
        Tax: {
          type: Number,
          // require: true,
        },
        LineTotal: {
          type: Number,
          require: true,
        },
        ActualPrice: {
          type: Number,
          require: true,
        },
      },
    ],
    SubTotal: {
      type: Number,
      require: true,
    },
    ActualPrice: {
      type: Number,
      require: true,
    },
    ShippingPrice: {
      type: Number,
      require: true,
    },
    // Tax: {
    //   type: Number,
    //   require: true,
    // },
    Total: {
      type: Number,
      require: true,
    },
    Invoice: {
      type: String,
      require: true,
    },
    InvoiceFileName: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

// orderSchema.pre("save", function (next) {
//   var doc = this;
//   counter
//     .findByIdAndUpdate(
//       { _id: "entityId" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     )
//     .then(function (count) {
//       console.log("...count: " + JSON.stringify(count));
//       doc.sort = count.seq;
//       next();
//     })
//     .catch(function (error) {
//       console.error("counter error-> : " + error);
//       throw error;
//     });
// });

// orderSchema.pre("save", function (next) {
//   var doc = this;
//   console.log("PRE");
//   console.log(doc);
//   counter.findByIdAndUpdate(
//     { _id: "entityId" },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true },
//     function (error, counter) {
//       if (error) return next(error);
//       doc.ID = counter.seq;
//       // doc.save();
//       console.log(doc.ID);
//       console.log(doc);
//       next();
//     }
//   );
// });

// orderSchema.pre("save", function (next) {
//   // Only increment when the document is new
//   if (this.isNew) {
//     entityModel.count().then((res) => {
//       this._id = res; // Increment count
//       next();
//     });
//   } else {
//     next();
//   }
// });

module.exports = Order = mongoose.model("order", orderSchema);
