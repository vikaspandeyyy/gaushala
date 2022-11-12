const User = require("../models/userModel");
const Product = require("../models/productModel");
const Stock = require("../models/stockModel");

exports.addToWishlist = async (req, res) => {
  const productId = req.body.productId;
  const userId = req.user._id;

  let foundProduct;
  try {
    foundProduct = await Product.findById(productId);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong  ",
    });
  }

  if (!foundProduct) {
    res.status(422).json({
      success: false,
      message: "Product not found",
    });
  }

  let FoundProductWithUser;
  try {
    FoundProductWithUser = await User.findOne({
      _id: userId,
      Wishlist: foundProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "something went wrong  6",
    });
  }

  if (FoundProductWithUser) {
    return res.status(422).json({
      success: false,
      message: "This product is already added to wishlist",
    });
  }

  User.findByIdAndUpdate(
    userId,
    {
      $push: { Wishlist: foundProduct },
    },
    { new: true }
  )
    .populate("Roles")
    .populate("Wishlist")
    .populate({ path: "Cart", populate: { path: "product" } })
    .populate("Orders")
    .select("-Password")
    .then((updatedUser) => {
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.addToCart = async (req, res) => {
  const productId = req.body.productId;
  const stockId = req.body.stockId;
  // const productId = req.body.productId;
  const userId = req.user._id;
  const qty = req.body.qty ? req.body.qty : 1;

  let foundProduct;
  try {
    foundProduct = await Product.findById(productId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (!foundProduct) {
    return res.status(422).json({
      success: false,
      message: "Product not found",
    });
  }

  if (foundProduct.options.length > 0 && !stockId) {
    return res.status(422).json({
      success: false,
      message: "Select Options",
    });
  }
  let stock;
  if (stockId) {
    try {
      stock = await Stock.findById(stockId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  let FoundProductWithUser;
  try {
    FoundProductWithUser = await User.findOne({
      _id: userId,
      Cart: { $elemMatch: { product: productId, stock: stockId } },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong  6",
    });
  }

  if (FoundProductWithUser) {
    return res.status(422).json({
      success: false,
      message: "This product is already added to cart",
    });
  }

  if (foundProduct.inventoryManagement && stock && stock.qty < qty) {
    return res.status(422).json({
      success: false,
      message: "Out of Stock",
    });
  }

  if (foundProduct.inventoryManagement && !stock && foundProduct.Qty < qty) {
    return res.status(422).json({
      success: false,
      message: "Out of Stock",
    });
  }

  User.findByIdAndUpdate(
    userId,
    {
      $push: { Cart: { product: foundProduct, stock: stock, qty: qty } },
    },
    { new: true }
  )
    .populate("Roles")
    .populate("Wishlist")
    .populate({
      path: "Cart",
      populate: [{ path: "product" }, { path: "stock" }],
    })
    .populate("Orders")
    .select("-Password")
    .then((updatedUser) => {
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.setQty = async (req, res) => {
  const productId = req.body.productId;
  const stockId = req.body.stockId;
  // const userId = req.user._id;

  const Cart = req.user.Cart;

  Cart.forEach((prod) => {
    if (
      prod.product._id == productId &&
      (!prod.stock || prod.stock._id == stockId)
    )
      prod.qty = req.body.qty;
  });
  // let savedUser;
  // try {
  //   savedUser = await req.user.save();
  // } catch (err) {
  //   res.status(500).json({
  //     success: false,
  //     message: "something went wrong",
  //   });
  // }

  req.user
    .save()
    .then((updatedUser) => {
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  console.log(productId);

  User.findByIdAndUpdate(
    userId,
    { $pull: { Wishlist: productId } },
    { new: true }
  )
    .populate("Roles")
    .populate("Wishlist")
    .populate({ path: "Cart", populate: { path: "product" } })
    .populate("Orders")
    .select("-Password")
    .then((updatedUser) => {
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteFromCart = async (req, res) => {
  const { productId, stockId } = req.body;
  const userId = req.body.userId ? req.body.userId : req.user._id;

  console.log(productId);

  User.findByIdAndUpdate(
    userId,
    { $pull: { Cart: { product: productId, stock: stockId } } },
    { new: true }
  )
    .populate("Roles")
    .populate("Wishlist")
    .populate({
      path: "Cart",
      populate: [{ path: "product" }, { path: "stock" }],
    })
    .populate("Orders")
    .select("-Password")
    .then((updatedUser) => {
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
