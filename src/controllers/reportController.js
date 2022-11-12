const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const getNameController = require("./getNameController");
var mongoose = require("mongoose");

exports.getBrandReport = async (req, res) => {
  let { searchWord } = req.body;

  let foundBrands;
  if (searchWord) {
    try {
      foundBrands = await Brand.find({ name: { $regex: searchWord , $options: "i"} });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  let foundBrandsIds;
  if (foundBrands) foundBrandsIds = foundBrands.map((brand) => brand._id);
  console.log(foundBrands);
  console.log(foundBrandsIds);

  let result;

  try {
    //result2 = await Product.find();
    if (searchWord) {
      result = await Product.aggregate([
        {
          $group: {
            _id: "$brand",
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { totalProducts: -1 } },
        {
          $match: {
            _id: {
              $in: foundBrandsIds,
            },
          },
        },
      ]);
    } else {
      result = await Product.aggregate([
        {
          $group: {
            _id: "$brand",
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { totalProducts: -1 } },
      ]);
    }

    let i = 0;
    for (const data of result) {
      result[i].name = await getNameController.getBrandNameById(result[i]._id);
      i++;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getCategoryReport = async (req, res) => {
  let { searchWord } = req.body;

  let foundCategory;
  if (searchWord) {
    try {
      foundCategory = await Category.find({ name: { $regex: searchWord, $options: "i" } });
      console.log(foundCategory);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }
  console.log(foundCategory);
  let foundCategoryIds;
  if (foundCategory) foundCategoryIds = foundCategory.map((brand) => brand._id);
  console.log(foundCategoryIds);

  let result;
  try {
    if (searchWord && foundCategoryIds) {
      result = await Product.aggregate([
        {
          $unwind: { path: "$categories" },
        },
        {
          $group: {
            _id: "$categories",
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { totalProducts: -1 } },
        {
          $match: {
            _id: {
              $in: foundCategoryIds,
            },
          },
        },
      ]);
    } else {
      result = await Product.aggregate([
        {
          $unwind: { path: "$categories" },
        },
        {
          $group: {
            _id: "$categories",
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { totalProducts: -1 } },
      ]);
    }
    let i = 0;
    for (const data of result) {
      result[i].name = await getNameController.getCategoryNameById(
        result[i]._id
      );
      i++;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getTagReport = async (req, res) => {
  let { searchWord } = req.body;

  let foundTag;
  if (searchWord) {
    // searchWord = "/" + searchWord + "/i"
    console.log(searchWord);
    try {
      foundTag = await Tag.find({ name: { $regex: searchWord, $options: "i" } });
      console.log(foundTag);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }
  console.log(foundTag);
  let foundTagIds;
  if (foundTag) foundTagIds = foundTag.map((tags) => tags._id);
  console.log(foundTagIds);

  let result;
  try {
    if (searchWord && foundTagIds) {
      result = await Product.aggregate([
        {
          $unwind: { path: "$tags" },
        },
        {
          $group: {
            _id: "$tags",
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { totalProducts: -1 } },
        {
          $match: {
            _id: {
              $in: foundTagIds,
            },
          },
        },
      ]);
    } else {
      result = await Product.aggregate([
        {
          $unwind: { path: "$tags" },
        },
        {
          $group: {
            _id: "$tags",
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { totalProducts: -1 } },
      ]);
    }
    let i = 0;
    for (const data of result) {
      result[i].name = await getNameController.getTagNameById(result[i]._id);
      i++;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getProductsPurchaseReports = async (req, res) => {
  const { searchWord, SKU, StartDate, EndDate, status, groupby } = req.body;
  let foundProducts;
  try {
    if (searchWord && SKU) {
      foundProducts = await Product.find({
        name: { $regex: searchWord, $options: "i" },
        SKU: { $regex: SKU, $options: "i" },
      });
    } else if (searchWord) {
      // console.log(se);
      foundProducts = await Product.find({ name: { $regex: searchWord, $options: "i" } });
      console.log(1);
    } else if (SKU) {
      foundProducts = await Product.find({ SKU: { $regex: SKU, $options: "i" } });
    } else {
      foundProducts = await Product.find();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  console.log(foundProducts);

  let foundProductsIds;
  if (foundProducts) foundProductsIds = foundProducts.map((r) => r._id);
  console.log(StartDate);

  // let filter = { Status: null, StartDate: null, EndDate: null };
  let filter = {};
  if (status) {
    filter.Status = status;
  }
  if (StartDate && EndDate) {
    filter.createdAt = { $gte: new Date(StartDate), $lte: new Date(EndDate) };
  }
  if (StartDate) {
    filter.createdAt = { $gte: new Date(StartDate) };
  }
  if (EndDate) {
    filter.createdAt = { $lte: new Date(EndDate) };
  }

  console.log(filter);

  // console.log(await Order.find({ createdAt: new Date(EndDate) }));

  let result;
  try {
    if (status || StartDate || EndDate) {
      console.log(1);
      result = await Order.aggregate([
        {
          $match: filter,
        },
        {
          $unwind: { path: "$ItemsOrdered" },
        },
        {
          $project: {
            product: "$ItemsOrdered.Product",
            Quantity: "$ItemsOrdered.Quantity",
            createdAt: "$createdAt",
            End: "$createdAt",
          },
        },
        {
          $group: {
            _id: "$product",
            total: { $sum: 1 },
            totalQty: { $sum: "$Quantity" },
            totalSale: { $sum: "$LineTotal" },
            startDate: { $first: "$createdAt" },
            endDate: { $last: "$createdAt" },
          },
        },

        {
          $match: {
            _id: {
              $in: foundProductsIds,
            },
          },
        },
      ]);
    } else {
      result = await Order.aggregate([
        {
          $unwind: { path: "$ItemsOrdered" },
        },
        {
          $project: {
            product: "$ItemsOrdered.Product",
            Quantity: "$ItemsOrdered.Quantity",
            createdAt: "$createdAt",
            End: "$createdAt",
          },
        },
        {
          $group: {
            _id: "$product",
            total: { $sum: 1 },
            totalQty: { $sum: "$Quantity" },
            totalSale: { $sum: "$LineTotal" },
            startDate: { $first: "$createdAt" },
            endDate: { $last: "$createdAt" },
          },
        },

        {
          $match: {
            _id: {
              $in: foundProductsIds,
            },
          },
        },
      ]);
    }
    // result = await Order.find({ createdAt: { $gte: EndDate } });
    // result = result.toArray();
    let i = 0;
    for (const data of result) {
      result[i].product = await getNameController.getProductById(result[i]._id);
      i++;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getCustomersOrderReport = async (req, res) => {
  const { name, email, status, StartDate, EndDate } = req.body;
  let foundUser;
  try {
    if (name && email) {
      foundUser = await User.find({
        "First Name": { $regex: name,  $options: "i" },
        Email: { $regex: email , $options: "i"},
      });
    } else if (name) {
      // console.log(se);
      foundUser = await User.find({ "First Name": { $regex: name , $options: "i"} });
      console.log(1);
    } else if (email) {
      foundUser = await User.find({ Email: { $regex: email , $options: "i"} });
    } else {
      foundUser = await User.find();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let foundUsersIds;
  if (foundUser) foundUsersIds = foundUser.map((r) => r._id);

  let filter = {};
  if (status) {
    filter.Status = status;
  }
  if (StartDate && EndDate) {
    ilter.createdAt = { $gte: new Date(StartDate), $lte: new Date(EndDate) };
  }
  if (StartDate) {
    filter.createdAt = { $gte: new Date(StartDate) };
  }
  if (EndDate) {
    filter.createdAt = { $lte: new Date(EndDate) };
  }

  console.log(filter);

  let result;
  try {
    if (status || StartDate || EndDate) {
      result = await Order.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: "$User",
            total: { $sum: 1 },
            totalProducts: { $sum: { $size: "$ItemsOrdered" } },
            totalSale: { $sum: "$Total" },
            startDate: { $first: "$createdAt" },
            endDate: { $last: "$createdAt" },
          },
        },
        {
          $match: {
            _id: {
              $in: foundUsersIds,
            },
          },
        },
      ]);
    } else {
      result = await Order.aggregate([
        {
          $group: {
            _id: "$User",
            total: { $sum: 1 },
            totalProducts: { $sum: { $size: "$ItemsOrdered" } },
            totalSale: { $sum: "$Total" },
            startDate: { $first: "$createdAt" },
            endDate: { $last: "$createdAt" },
          },
        },
        {
          $match: {
            _id: {
              $in: foundUsersIds,
            },
          },
        },
      ]);
    }
    let i = 0;
    for (const data of result) {
      result[i].user = await getNameController.getCustomerById(result[i]._id);
      result[i].user.Password = null;
      i++;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getShippingReport = async (req, res) => {
  const { StartDate, EndDate, OrderStatus, ShippingMethod } = req.body;

  const filter = {};
  if (ShippingMethod) {
    filter.ShippingMethod = ShippingMethod;
  }
  if (OrderStatus) {
    filter.Status = OrderStatus;
  }
  if (StartDate && EndDate) {
    filter.createdAt = { $gte: new Date(StartDate), $lte: new Date(EndDate) };
  } else if (StartDate) {
    filter.createdAt = { $gte: new Date(StartDate) };
  } else if (EndDate) {
    filter.createdAt = { $gte: new Date(EndDate) };
  }

  let result;
  try {
    if (StartDate || EndDate || OrderStatus || ShippingMethod) {
      result = await Order.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: "$ShippingMethod",
            totalOrders: { $sum: 1 },
            total: { $sum: "$ShippingPrice" },
            startDate: { $first: "$createdAt" },
            endDate: { $last: "$createdAt" },
          },
        },
      ]);
    } else {
      result = await Order.aggregate([
        {
          $group: {
            _id: "$ShippingMethod",
            totalOrders: { $sum: 1 },
            total: { $sum: "$ShippingPrice" },
            startDate: { $first: "$createdAt" },
            endDate: { $last: "$createdAt" },
          },
        },
      ]);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getProductStock = async (req, res) => {
  const { above, below, stockAvailability } = req.body;

  let filter = {};
  if (above && below) {
    filter.Qty = { $gte: above, $lte: below };
  } else if (above) {
    filter.Qty = { $gte: above };
  } else if (below) {
    filter.Qty = { $lte: below };
  }
  if (stockAvailability) {
    filter.stockAvailability = stockAvailability;
  }

  let result;
  try {
    if (above || below || stockAvailability)
      result = await Product.find(filter);
    else result = await Product.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};
