const Order = require("../models/orderModel");
const Counter = require("../models/orderCounterModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionsModel");
const FlashSale = require("../models/flashSaleModel");
const Tax = require("../models/taxModel");
const Setting = require("../models/settingModel");
const Storefront = require("../models/storefrontModel");
const StockModel = require("../models/stockModel");
const nodemailer = require("nodemailer");
const { mailCreateTransport } = require("./mailController");
const niceInvoice = require("nice-invoice");
// const dateFormat = require("dateformat");
const date = require("date-and-time");
const { convert } = require("html-to-text");

const getKeysFromSettings = async (type) => {
  let data;
  try {
    data = await Setting.find({});
  } catch (err) {
    console.log(err);
  }
  // console.log(data[0]["Mail"]);
  return data[0][type];
};
const getStorefrontSettings = async (type) => {
  let data;
  try {
    data = await Storefront.find({});
  } catch (err) {
    console.log(err);
  }
  // console.log(data[0]["Mail"]);
  return data[0][type];
};

exports.addOrder = async (req, res) => {
  const {
    Status,
    ShippingMethod,
    PaymentMethod,
    Address,
    ShippingPrice,
    Discount,
  } = req.body.data;

  // const testAccount = await nodemailer.createTestAccount();
  const Mail = await getKeysFromSettings("Mail");

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  if (Mail.WelcomeEmail) {
    mailCreateTransport(Mail);
  }

  const { ItemsOrdered } = req.body;

  const UserId = req.body.UserId ? req.body.UserId : req.user._id;

  if (
    !Status ||
    !ShippingMethod ||
    !PaymentMethod ||
    !Address ||
    !UserId ||
    !ItemsOrdered
  ) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields 1",
    });
  }

  if (
    !Address.BillingAddress.Name ||
    !Address.BillingAddress.AddressLine1 ||
    !Address.BillingAddress.Country ||
    !Address.BillingAddress.Pin ||
    !Address.BillingAddress.City ||
    !Address.BillingAddress.State ||
    !Address.ShippingAddress.Name ||
    !Address.ShippingAddress.AddressLine1 ||
    !Address.ShippingAddress.Country ||
    !Address.ShippingAddress.Pin ||
    !Address.ShippingAddress.City ||
    !Address.ShippingAddress.State
  ) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let FoundUser;
  try {
    FoundUser = await User.findById(UserId);
  } catch {
    return res.status(500).json({
      success: false,
      message: "something went wrong 1",
    });
  }

  if (!FoundUser) {
    return res.status(422).json({
      success: false,
      message: "User doesn't exists",
    });
  }

  // ************************************* Checking Validity *****************************************

  let SubTotal = 0,
    ActualPrice = 0;

  const requiredProducts = ItemsOrdered.map(async (item) => {
    if (!item.ProductId || !item.Quantity) {
      return null;
    }

    let foundProduct;
    try {
      foundProduct = await Product.findById(item.ProductId);
    } catch (err) {
      return null;
    }

    if (!foundProduct) {
      return null;
    }

    let LineTotal = 0;
    const date = new Date();

    const filter = {
      products: {
        $elemMatch: { product: item.ProductId },
        $lte: { endDate: new Date() },
      },
    };

    let flashSales;
    try {
      flashSales = await FlashSale.find(filter);
    } catch (err) {
      console.log(err);
      return null;
    }

    let minPrice = foundProduct.price,
      quantity;
    flashSales.forEach((sale) => {
      sale.products.map((product) => {
        if (product.product == item.ProductId) {
          if (product.price && product.price < minPrice) {
            minPrice = product.price;
            quantity = product.quantity;
          }
        }
      });
    });

    let quantityWithDiscount =
      quantity < item.Quantity ? quantity : item.Quantity;
    LineTotal =
      quantityWithDiscount * minPrice +
      (item.Quantity - quantityWithDiscount) * foundProduct.price;

    // console.log(flashSales);

    if (flashSales.length == 0) {
      // console.log(123);
      let stock;
      if (item.StockId) {
        try {
          stock = await StockModel.findById(item.StockId);
        } catch (err) {
          console.log(err);
          return null;
        }

        if (!stock) {
          return null;
        }
      }
      if (
        stock &&
        foundProduct.inventoryManagement &&
        stock.qty < item.Quantity
      ) {
        return { status: false, message: "Out of Stock" };
      }
      if (stock && stock.price > 0) {
        LineTotal = item.Quantity * stock.price;
      } else if (
        date >= foundProduct.specialPriceStart &&
        (date <= foundProduct.specialPriceEnd || !foundProduct.specialPriceEnd)
      ) {
        // console.log("YES");
        if (foundProduct.specialPriceType == "Percent")
          LineTotal =
            (item.Quantity * (foundProduct.specialPrice * foundProduct.price)) /
            100;
        else if (foundProduct.specialPriceType == "Fixed")
          LineTotal = item.Quantity * foundProduct.specialPrice;
        else {
          LineTotal = item.Quantity * foundProduct.specialPrice;
        }
      } else {
        LineTotal = item.Quantity * foundProduct.price;
      }
    }
    SubTotal += LineTotal;

    ActualPrice += foundProduct.price * item.Quantity;
    console.log("TAX", foundProduct.taxClass);
    const ITEM = {
      ...item,
      Product: foundProduct,
      Stock: item.StockId,
      UnitPrice: foundProduct.price,
      LineTotal,
      ActualPrice: foundProduct.price * item.Quantity,
      Tax: foundProduct.taxClass ? foundProduct.taxClass.rate : 0,
    };

    return ITEM;
  });

  const Items_Ordered = await Promise.all(requiredProducts);
  // console.log(Items_Ordered);

  const Total = SubTotal + ShippingPrice;

  // console.log(SubTotal, ShippingPrice, Discount);

  // const YourSaving = ActualPrice + ShippingPrice - Total;
  // console.log("YourSaving:  ", YourSaving);
  // console.log("Total:  ", Total);

  let lastOrder = [];
  try {
    lastOrder = await Order.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  // console.log(lastOrder);

  let newId = lastOrder[0] ? lastOrder[0].ID + 1 : 1;

  const order = new Order({
    ...req.body.data,
    ID: newId || 1,
    ItemsOrdered: Items_Ordered,
    User: FoundUser,
    SubTotal,
    Total,
    ActualPrice,
  });

  // console.log(order);

  let addedOrder;

  try {
    addedOrder = await order.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  // ********************************** Order Saved ********************************

  addedOrder.ItemsOrdered.map(async (item) => {
    let PRODUCT;
    try {
      PRODUCT = await Product.findById(item.Product);
    } catch (err) {
      console.log(err);
      return null;
    }
    let STOCK;
    try {
      STOCK = await Product.findById(item.Stock);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!item.Stock) PRODUCT.Qty -= item.Quantity;
    else {
      STOCK.qty -= item.Quantity;
    }
    PRODUCT.OrderedQty += item.Quantity;
    // PRODUCT.Qty -= item.Quantity;
    // if (PRODUCT.Qty < 1) PRODUCT.stockAvailability = "Out Of Stock";

    try {
      await PRODUCT.save();
    } catch (err) {
      console.log(err);
    }
    if (item.Stock) {
      // console.log(item.Stock);
      await STOCK.save();
    }
  });

  // ********************************* Stock Management ******************************

  const Store = await getKeysFromSettings("Store");
  const LOGO = await getStorefrontSettings("Logo");
  const Footer = await getStorefrontSettings("Footer");
  // console.log(LOGO, "AAAAAAAAAAAAAAAAAAAA");

  const htmlFoorter = Footer.FooterCopyrightText;
  const textFooter = convert(htmlFoorter, {
    wordwrap: 130,
  });

  // console.log();
  // console.log(addedOrder.ShippingAddress, addedOrder);
  const invoiceDetail = {
    shipping: {
      name: addedOrder.Address.ShippingAddress.Name,
      address:
        addedOrder.Address.ShippingAddress.AddressLine1 +
        (addedOrder.Address.ShippingAddress.AddressLine2
          ? ", " + addedOrder.Address.ShippingAddress.AddressLine2
          : ""),
      city: addedOrder.Address.ShippingAddress.City,
      state: addedOrder.Address.ShippingAddress.State,
      country: addedOrder.Address.ShippingAddress.Country,
      postal_code: addedOrder.Address.ShippingAddress.Pin,
    },
    subtotal: addedOrder.SubTotal,
    total: addedOrder.Total,
    order_number: addedOrder.ID,
    header: {
      company_name: Store.StoreName,
      company_logo: LOGO.Favicon.image,
      company_address: `${Store.StoreAddress1} ${
        Store.StoreAddress2 ? Store.StoreAddress2 : ""
      } ${Store.StoreCity ? Store.StoreCity : ""} ${
        Store.StoreState ? Store.StoreState : ""
      } ${Store.StoreCountry ? Store.StoreCountry : ""} ${
        Store.StoreZip ? Store.StoreZip : ""
      }`,
    },
    footer: {
      text: textFooter,
    },
    currency_symbol: "₹",
    date: {
      billing_date: date.format(addedOrder.createdAt, "ddd, MMM DD YYYY"),
      due_date: date.format(addedOrder.createdAt, "ddd, MMM DD YYYY"),
    },
  };

  invoiceDetail.items = addedOrder.ItemsOrdered.map((item) => {
    console.log(item.Tax);
    return {
      item: item.Product.name + (item.Stock ? ", " + item.Stock.name : ""),
      description: item.Product.description,
      quantity: item.Quantity,
      price: item.LineTotal / item.Quantity,
      tax: item.Tax ? item.Tax + " %": "",
    };
  });

  const fileName = `${addedOrder.ID}-${req.user["First Name"]}-${Date.now()}`;
  const invoiceName = `uploads/invoice/${fileName}.pdf`;
  // console.log(invoiceDetail);
  niceInvoice(invoiceDetail, invoiceName);

  addedOrder.Invoice = invoiceName;
  addedOrder.InvoiceFileName = fileName;
  addedOrder.save();
  // niceInvoice(
  //   invoiceDetail,
  //   `/uploads/invoice/${addedOrder.ID}-${req.user["First Name"]}-${Date.now()}.pdf`
  // );

  // ************************************* Invoice ***********************************

  let lastTransaction = [];
  try {
    lastTransaction = await Transaction.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  // console.log(lastTransaction);

  newId = lastTransaction[0] ? lastTransaction[0].ID + 1 : 1;

  const transaction = new Transaction({
    Order_id: addedOrder._id,
    OrderID: addedOrder.ID,
    ID: newId || 1,
    PaymentMethod: addedOrder.PaymentMethod,
  });

  let addedTransaction;
  try {
    addedTransaction = await transaction.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 5",
    });
  }

  // *********************************** Transaction ************************************

  if (Mail.WelcomeEmail) {
    let info;
    try {
      info = await transporter.sendMail({
        from: `${Mail.MailFromName} <${Mail.MailFromAddress}> `, // sender address
        to: req.user.Email, // list of receivers
        subject: "Order Placed", // Subject line
        text: "Order Placed", // plain text body
        html: "Order Placed", // html body
        attachments: [
          {
            filename: `${addedOrder.InvoiceFileName}`, // <= Here: made sure file name match
            path: `${addedOrder.Invoice}`, // <= Here
            contentType: "application/pdf",
          },
        ],
      });
    } catch (err) {
      return console.log(err);
    }

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      UserId,
      { $push: { Orders: addedOrder }, Cart: [] },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 6",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      order: addedOrder,
      transaction: addedTransaction,
      user: updatedUser,
    },
  });
};

exports.getOrderById = (req, res) => {
  Order.findById(req.params.id)
    .populate({ path: "User", select: "-Password -Permissions" })
    .populate({
      path: "ItemsOrdered",
      populate: [{ path: "Product" }, { path: "Stock" }],
    })

    .then((order) => {
      return res.status(200).json({
        success: true,
        data: order,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getOrders = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Order.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate({ path: "User", select: "-Password -Permissions" })
    .populate({
      path: "ItemsOrdered",
      populate: [{ path: "Product" }, { path: "Stock" }],
    })
    .then((attribute) => {
      res.status(200).json({
        success: true,
        data: attribute,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.searchOrders = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Order.find({ Status: searchWord })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate({ path: "User", select: "-Password -Permissions" })
      .populate({
        path: "ItemsOrdered",
        populate: [{ path: "Product" }, { path: "Stock" }],
      })
      .then((brand) => {
        return res.status(200).json({
          success: true,
          data: brand,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "something went wrong",
        });
      });
  }
};

exports.editOrder = (req, res) => {
  if (!req.body._id) {
    return res.status(422).json({
      success: false,
      message: "Please send the order id",
    });
  }
  if (!req.body.data.Status) {
    return res.status(422).json({
      success: false,
      message: "Please all the details",
    });
  }

  Order.findByIdAndUpdate(
    req.body._id,
    { Status: req.body.data.Status },
    { new: true }
  )
    .then((updatedOrder) => {
      return res.status(200).json({
        success: true,
        data: updatedOrder,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getOrdersByUserId = (req, res) => {
  Order.find({ User: req.params.userId })
    .populate({ path: "product" })
    .populate({ path: "User", select: "-Password -Permissions" })
    .populate({
      path: "ItemsOrdered",
      populate: [{ path: "Product" }, { path: "Stock" }],
    })
    .then((attribute) => {
      res.status(200).json({
        success: true,
        data: attribute,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
