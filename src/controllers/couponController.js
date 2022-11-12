const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Category = require("../models/categoryModel");

exports.addCoupon = async (req, res) => {
  const { productIds, excludedProductIds, categoryIds, excludedCategoryIds } =
    req.body;

  if (!req.body.data.name || !req.body.data.code) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundCoupon = null;
  try {
    foundCoupon = await Coupon.findOne({ code: req.body.data.code });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundCoupon) {
    console.log(foundCoupon);
    return res.status(422).json({
      success: false,
      message: "This coupon code already exists",
    });
  }

  let products = [];
  try {
    products = await Product.find({ _id: { $in: productIds } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let excludedProducts = [];
  try {
    excludedProducts = await Product.find({ _id: { $in: excludedProductIds } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let categories = [];
  try {
    categories = await Category.find({ _id: { $in: categoryIds } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let excludedCategories = [];
  try {
    excludedCategories = await Category.find({
      _id: { $in: excludedCategoryIds },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let lastCoupon = [];
  try {
    lastCoupon = await Coupon.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastCoupon);

  const newId = lastCoupon[0] ? lastCoupon[0].ID + 1 : 1;

  const coupon = new Coupon({
    ...req.body.data,
    ID: newId || 1,
    products,
    excludedProducts,
    categories,
    excludedCategories,
  });

  let addedCoupon;

  try {
    addedCoupon = await coupon.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  return res.status(200).json({
    success: true,
    data: addedCoupon,
  });
};

exports.getCouponById = (req, res) => {
  Coupon.findById(req.params.id)
    .then((coupon) => {
      res.status(200).json({
        success: true,
        data: coupon,
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

exports.getCoupons = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Coupon.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
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

exports.getValidCouponByProduct = async (req, res) => {
  const { productId, code } = req.body;
  let foundCoupon;
  try {
    foundCoupon = await Coupon.findOne({ code: code });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let foundProduct;
  try {
    foundProduct = await Product.findById(productId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
  let couponValid = false;

  if (foundCoupon.usedCoupon == foundCoupon.usageLimitPerCoupon)
    couponValid = false;
  else if (
    foundCoupon.products.length == 0 &&
    !foundProduct.categories.some((item) =>
      foundCoupon.excludedCategories.includes(item._id)
    ) &&
    !foundCoupon.excludedProducts.includes(productId)
  )
    couponValid = true;
  else if (foundCoupon.products.includes(productId)) couponValid = true;
  else if (
    foundProduct.categories.some((item) =>
      foundCoupon.categories.includes(item._id)
    ) &&
    !foundCoupon.excludedProducts.includes(productId)
  )
    couponValid = true;

  console.log(
    foundCoupon.categories.some((item) =>
      foundProduct.categories.includes(item)
    ),
    "YES"
  );

  foundProduct.categories.forEach((item) => {
    console.log(item);
    console.log(foundCoupon.categories);
    if (foundCoupon.categories.includes(item._id)) {
      console.log("IT IS TRUE");
    } else console.log("NO");
  });
  // Coupon.find({ freeshipping: true, products: foundProduct })
  //   .then((coupons) => {
  //     coupons = coupons.filter((c) => c.usageLimitPerCoupon != c.usedCoupon);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return res.status(500).json({
  //       success: false,
  //       message: "something went wrong",
  //     });
  //   });
  console.log(couponValid);
  if (couponValid) {
    return res.status(200).json({
      success: true,
      data: foundCoupon,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Coupon not valid",
    });
  }
};

exports.searchCoupons = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Coupon.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
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

exports.editProduct = async (req, res) => {
  const { productIds, excludedProductIds, categoryIds, excludedCategoryIds } =
    req.body;

  let foundCoupon = null;
  try {
    foundCoupon = await Coupon.findOne({ code: req.body.data.code });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundCoupon && foundCoupon._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This coupon code already exists",
    });
  }

  let products = [];
  try {
    products = await Product.find({ _id: { $in: productIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let excludedProducts = [];
  try {
    excludedProducts = await Product.find({ _id: { $in: excludedProductIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let categories = [];
  try {
    categories = await Category.find({ _id: { $in: categoryIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let excludedCategories = [];
  try {
    excludedCategories = await Category.find({
      _id: { $in: excludedCategoryIds },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  let updatedCoupon;

  try {
    updatedCoupon = await Coupon.findByIdAndUpdate(
      req.body._id,
      {
        ...req.body.data,
        products: products,
        excludedProducts: excludedProducts,
        categories: categories,
        excludedCategories: excludedCategories,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedCoupon,
  });
};

exports.deleteCoupons = (req, res) => {
  const id = req.body.id;

  Coupon.deleteMany({ _id: { $in: id } })
    .then((data) => {
      return res.status(200).json({
        success: "true",
        data: {
          data,
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
