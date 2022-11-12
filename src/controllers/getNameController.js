const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// function
exports.getBrandNameById = async (id) => {
  let result;
  try {
    result = await Brand.findById(id);
  } catch (err) {
    return "BrandNotFound";
  }

  if (result) return result.name;
  return "Brand Not Found";
};

exports.getCategoryNameById = async (id) => {
  let result;
  try {
    result = await Category.findById(id);
  } catch (err) {
    return "CategoryNotFound";
  }

  if (result) return result.name;
  return "Category Not Found";
};

exports.getTagNameById = async (id) => {
  let result;
  try {
    result = await Tag.findById(id);
  } catch (err) {
    return "Tag Not Found";
  }

  if (result) return result.name;
  return "Tag Not Found";
};

exports.getProductById = async (id) => {
  let result;
  try {
    result = await Product.findById(id);
  } catch (err) {
    return "Product Not Found";
  }

  if (result) return result;
  return "Product Not Found";
};
exports.getCustomerById = async (id) => {
  let result;
  try {
    result = await User.findById(id);
  } catch (err) {
    return "Customer Not Found";
  }

  if (result) return result;
  return "Customer Not Found";
};
