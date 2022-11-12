const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

exports.getTotalOrders = (req, res) => {
  Order.count()
    .then((count) => {
      res.status(200).json({
        status: true,
        data: count,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getTotalProucts = (req, res) => {
  Product.count()
    .then((count) => {
      res.status(200).json({
        status: true,
        data: count,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getLatestReviews = (req, res) => {
  Review.find()
    .sort("-createdAt")
    .populate({ path: "product" })
    .limit(6)
    .then((review) => {
      res.status(200).json({
        status: true,
        data: review,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getLatestOrders = (req, res) => {
  Order.find()
    .sort("-createdAt")
    .limit(6)
    .populate({ path: "User" })
    .then((order) => {
      res.status(200).json({
        status: true,
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

exports.getTotalCustomers = async (req, res) => {
  let foundRole;
  try {
    foundRole = await Role.findOne({ Name: "Customer" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
  User.find({ Roles: foundRole._id })
    .count()
    .then((customer) => {
      res.status(200).json({
        status: true,
        data: customer,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
