const fs = require("fs");
const csv = require("csvtojson");

const Product = require("../models/productModel");
const Brand = require("../models/brandModel");
const Media = require("../models/mediaModel");
const Tag = require("../models/tagModel");
const Category = require("../models/categoryModel");
const Tax = require("../models/taxModel");
const Attribute = require("../models/attributeModel");

exports.addImporter = async (req, res) => {
  // console.log(req.file);
  // console.log(`/${req.file.path}`);

  const csvFilePath = req.file.path;

  let jsonArray;
  try {
    jsonArray = await csv().fromFile(csvFilePath);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  // console.log(jsonArray);

  fs.unlink(req.file.path, (err) => {
    console.log(err);
  });

  const addedProducts = jsonArray.map(async (result, INDEX) => {
    if (!result["Name *"] || !result["Description *"] || !result["Price *"]) {
      return null;
    }

    let foundProduct = null;
    try {
      foundProduct = await Product.findOne({ name: result["Name *"] });
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    if (foundProduct) {
      // console.log(foundProduct);
      return {
        success: false,
        message: "This product name already exists",
      };
    }

    let brand;
    if (result.Brand) {
      try {
        brand = await Brand.findOne({ ID: result.Brand });
      } catch (err) {
        return {
          success: false,
          message: "Something went wrong",
        };
      }
    }
    // console.log(brand);

    let baseImage;
    if (result["Base Image"]) {
      try {
        baseImage = await Media.findOne({ ID: result["Base Image"] });
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: "Something went wrong",
        };
      }
    }
    let taxClass;
    console.log(result["Tax Class"], "CLASS");
    if (result["Tax Class"]) {
      try {
        taxClass = await Tax.findOne({ ID: result["Tax Class"] });
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: "Something went wrong",
        };
      }
    }

    console.log(taxClass, "TAX");

    // console.log(baseImage, "BASEIMAGE");
    let TagsIDs = "[" + result.Tags + "]";
    // let TagsIDs = result.Tags ;
    TagsIDs = JSON.parse(TagsIDs);
    // console.log(TagsIDs);
    TagsIDs.map((t, i) => console.log(t, i));

    let tags = [];
    try {
      tags = await Tag.find({ ID: { $in: TagsIDs } });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    // console.log(tags);

    let additionalImages = [];
    try {
      additionalImages = await Media.find({
        ID: { $in: JSON.parse("[" + result["Additional Images"] + "]") },
      });
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    // // let downloads = [];
    // // try {
    // //   downloads = await Media.find({ _id: { $in: downloadsIds } });
    // // } catch (err) {
    // //   return res.status(500).json({
    // //     success: false,
    // //     message: "something went wrong 6",
    // //   });
    // // }

    let categories = [];
    try {
      categories = await Category.find({
        ID: { $in: JSON.parse("[" + result.Categories + "]") },
      });
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    let relatedProducts = [];
    try {
      relatedProducts = await Product.find({
        ID: { $in: JSON.parse("[" + result["Related Products"] + "]") },
      });
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    let upSells = [];
    try {
      upSells = await Product.find({
        ID: { $in: JSON.parse("[" + result["Up Sells"] + "]") },
      });
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    let crossSells = [];
    try {
      crossSells = await Product.find({
        ID: { $in: JSON.parse("[" + result["Cross Sells"] + "]") },
      });
    } catch (err) {
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    let index = 1;
    let attributeArray = [];
    while (result[`Attribute ${index}`]) {
      // console.log(
      //   index,
      //   "index",
      //   result["Name *"],
      //   result[`Attribute ${index}`],
      //   result[`Attribute ${index} Values`]
      // );
      if (result[`Attribute ${index} Values`] && result[`Attribute ${index}`]) {
        attributeArray.push({
          ID: result[`Attribute ${index}`],
          value: JSON.parse("[" + result[`Attribute ${index} Values`] + "]"),
        });
      }
      index += index;
    }

    // console.log(attributeArray);

    index = 1;
    let optionsArray = [];
    while (result[`Option ${index} Name`]) {
      let valueArray = [];
      let j = 1;
      while (result[`Option ${index} Value ${j} Price`]) {
        valueArray.push({
          label: result[`Option ${index} Value ${j} Label`],
          price: result[`Option ${index} Value ${j} Price`],
          priceType: result[`Option ${index} Value ${j} Price Type`],
        });
        j += 1;
      }

      // console.log(valueArray);

      optionsArray.push({
        name: result[`Option ${index} Name`],
        type: result[`Option ${index} Type`],
        required: result[`Option ${index} is Required`],
        value: valueArray,
      });
      index += 1;
    }

    console.log(optionsArray);

    let A;
    if (attributeArray) {
      const requiredAttributes = attributeArray.map(async (at) => {
        let foundAttribute;
        try {
          foundAttribute = await Attribute.findOne({ ID: at.ID });
        } catch (err) {
          return null;
        }

        if (!foundAttribute) {
          return null;
        }

        let values = at.value.map((v) => {
          {
            console.log(v);
            return foundAttribute.value[v] ? foundAttribute.value[v] : null;
          }
        });
        console.log(values);
        // values = values.filter((v) => v != null);

        const attribute = {
          value: values,
          attribute: foundAttribute,
        };

        return attribute;
      });

      A = await Promise.all(requiredAttributes);
    }
    // console.log(A, "A");
    A = A.filter((a) => a != null);
    // console.log(A);

    const url = result["Name *"].toLowerCase().split(" ").join("-");

    let lastProduct = [];
    try {
      lastProduct = await Product.find().sort("-createdAt").limit(1);
    } catch (err) {
      console.log(err);
      // return res.status(422).json({
      //   success: false,
      //   message: "This media doesn't exists",
      // });
    }

    // console.log(lastProduct);

    const newId = lastProduct[0] ? lastProduct[0].ID + 1 + INDEX : 1 + INDEX;

    const product = new Product({
      ID: newId || 1 + INDEX,
      url,
      attributes: A,
      options: optionsArray,
      name: result["Name *"],
      price: result["Price *"],
      specialPrice: result["Special Price"],
      specialPriceType: result["Special Price Type"],
      specialPriceStart: result["Special Price Start"],
      specialPriceEnd: result["Special Price End"],
      description: result["Description *"],
      shortDescription: result["Short Description"],
      SKU: result.SKU,
      inventoryManagement: result["Manage Stock"],
      Qty: result.Quantity,
      stockAvailability: result["In Stock"],
      metaTitle: result["Meta Title"],
      metaDescription: result["Meta Description"],
      productNewFrom: result["New From"],
      productNewTo: result["New To"],
      tags,
      taxClass,
      brand: brand,
      baseImage: baseImage,
      additionalImages,
      categories,
      relatedProducts,
      upSells,
      // crossSells,
    });
    // console.log(product, "Hello");
    // return product;

    // let i = product.inventoryManagement;
    // console.log(product.inventoryManagement[i]);

    let savedProduct;
    try {
      savedProduct = await product.save();
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "Something went wrong",
      };
    }

    // console.log(savedProduct);
    return savedProduct;
  });

  PRODUCTS = await Promise.all(addedProducts);

  res.status(200).json({ status: true, data: PRODUCTS });
};
