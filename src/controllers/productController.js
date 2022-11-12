const Product = require("../models/productModel");
const Brand = require("../models/brandModel");
const Tag = require("../models/tagModel");
const Category = require("../models/categoryModel");
const Media = require("../models/mediaModel");
const Attribute = require("../models/attributeModel");
const Tax = require("../models/taxModel2");

exports.addProduct = async (req, res) => {
  const {
    brandId,
    tagIds,
    categoryIds,
    relatedProductIds,
    upSellsIds,
    crossSellsIds,
    attributes,
    baseImageId,
    additionalImageIds,
    downloadsIds,
    taxId,
  } = req.body;

  if (
    !req.body.data.name ||
    !req.body.data.description ||
    !req.body.data.price
  ) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundProduct = null;
  try {
    foundProduct = await Product.findOne({ name: req.body.data.name });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 1",
    });
  }

  if (foundProduct) {
    console.log(foundProduct);
    return res.status(422).json({
      success: false,
      message: "This product name already exists",
    });
  }

  let brand;
  if (brandId) {
    try {
      brand = await Brand.findById(brandId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  }

  let tax;
  if (taxId) {
    console.log(taxId);
    try {
      tax = await Tax.findById(taxId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  }

  console.log(tax);

  // if (!brand) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "This brand doesn't exists",
  //   });
  // }

  let baseImage;
  if (baseImageId) {
    try {
      baseImage = await Media.findById(baseImageId);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 3",
      });
    }
  }

  // if (!baseImage) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "This media doesn't exists",
  //   });
  // }

  let tags = [];
  try {
    tags = await Tag.find({ _id: { $in: tagIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  let additionalImages = [];
  try {
    additionalImages = await Media.find({ _id: { $in: additionalImageIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 5",
    });
  }

  let downloads = [];
  try {
    downloads = await Media.find({ _id: { $in: downloadsIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 6",
    });
  }

  let categories = [];
  try {
    categories = await Category.find({ _id: { $in: categoryIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 11",
    });
  }

  let relatedProducts = [];
  try {
    relatedProducts = await Product.find({ _id: { $in: relatedProductIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 12",
    });
  }

  let upSells = [];
  try {
    upSells = await Product.find({ _id: { $in: upSellsIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 7",
    });
  }

  let crossSells = [];
  try {
    crossSells = await Product.find({ _id: { $in: crossSellsIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 8",
    });
  }

  let A;
  if (attributes) {
    const requiredAttributes = attributes.map(async (at) => {
      if (!at.attributeId || !at.value) {
        return null;
      }

      let foundAttribute;
      try {
        foundAttribute = await Attribute.findById(at.attributeId);
      } catch (err) {
        return null;
      }

      if (!foundAttribute) {
        return null;
      }

      const attribute = {
        ...at,
        attribute: foundAttribute,
      };

      return attribute;
    });

    A = await Promise.all(requiredAttributes);
  }
  A = A.filter((a) => a != null);
  const url = req.body.data.name.toLowerCase().split(" ").join("-");

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

  const newId = lastProduct[0] ? lastProduct[0].ID + 1 : 1;

  const product = new Product({
    ...req.body.data,
    ID: newId || 1,
    tags,
    taxClass: tax,
    brand,
    categories,
    relatedProducts,
    upSells,
    crossSells,
    attributes: A,
    url,
    baseImage,
    additionalImages,
    downloads,
    // LeftQty: req.body.data.Qty,
  });

  let addedProduct;

  try {
    addedProduct = await product.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 10",
    });
  }

  return res.status(200).json({
    success: true,
    data: addedProduct,
  });
};

exports.getProducts = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Product.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .lean()
    .populate("attributes.attribute")
    .populate("brand")
    .populate({ path: "tags" })
    .populate({ path: "categories" })
    .populate({ path: "options" })
    .populate({ path: "relatedProducts" })
    .populate({ path: "upSells" })
    .populate({ path: "crossSells" })
    .populate({ path: "baseImage" })
    .populate({ path: "additionalImages" })
    .populate({ path: "downloads" })
    .then((product) => {
      res.status(200).json({
        success: true,
        data: product,
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

exports.searchProducts = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Product.find({ name: { $regex: searchWord, $options: "i" } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .lean()
      .populate("attributes.attribute")
      .populate("brand")
      .populate({ path: "tags" })
      .populate({ path: "categories" })
      .populate({ path: "attributes", populate: { path: "attribute" } })
      .populate({ path: "options" })
      .populate({ path: "relatedProducts" })
      .populate({ path: "upSells" })
      .populate({ path: "crossSells" })
      .populate({ path: "baseImage" })
      .populate({ path: "additionalImages" })
      .populate({ path: "downloads" })
      .then((products) => {
        return res.status(200).json({
          success: true,
          data: products,
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

exports.getProductsById = (req, res) => {
  Product.findById(req.params.id)
    .populate("brand")
    .populate("attributes.attribute")
    .populate({ path: "tags" })
    .populate({ path: "categories" })
    .populate({ path: "attributes", populate: { path: "attribute" } })
    .populate({ path: "options" })
    .populate({ path: "relatedProducts" })
    .populate({ path: "upSells" })
    .populate({ path: "crossSells" })
    .populate({ path: "baseImage" })
    .populate({ path: "additionalImages" })
    .populate({ path: "downloads" })
    .then((product) => {
      console.log(product);
      res.status(200).json({
        success: true,
        data: product,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.editProduct = async (req, res) => {
  const {
    brandId,
    tagIds,
    categoryIds,
    relatedProductIds,
    upSellsIds,
    crossSellsIds,
    attributes,
    baseImageId,
    additionalImageIds,
    downloadsIds,
    taxId,
  } = req.body;

  let foundProduct;
  try {
    foundProduct = await Product.findOne({ name: req.body.data.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundProduct && foundProduct._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This product name already exists",
    });
  }

  let foundProductByUrl;
  try {
    foundProductByUrl = await Product.findOne({ url: req.body.data.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundProductByUrl && foundProductByUrl._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This product url already exists",
    });
  }

  let brand;
  if (brandId) {
    try {
      brand = await Brand.findById(brandId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  }

  let tax;
  if (taxId) {
    try {
      tax = await Tax.findById(taxId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  }

  // if (!brand) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "This brand doesn't exists",
  //   });
  // }

  let baseImage;
  if (baseImageId) {
    try {
      baseImage = await Media.findById(baseImageId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  }

  // if (!baseImage) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "This media doesn't exists",
  //   });
  // }

  let tags = [];
  try {
    tags = await Tag.find({ _id: { $in: tagIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let additionalImages = [];
  try {
    additionalImages = await Media.find({ _id: { $in: additionalImageIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let downloads = [];
  try {
    downloads = await Media.find({ _id: { $in: downloadsIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
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

  console.log(categories);

  let relatedProducts = [];
  try {
    relatedProducts = await Product.find({ _id: { $in: relatedProductIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let upSells = [];
  try {
    upSells = await Product.find({ _id: { $in: upSellsIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let crossSells = [];
  try {
    crossSells = await Product.find({ _id: { $in: crossSellsIds } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
  let A;
  if (attributes) {
    const requiredAttributes = attributes.map(async (at) => {
      if (!at.attributeId || !at.value) {
        return res.status(422).json({
          success: false,
          message: "Please fill all the required fields",
        });
      }

      let foundAttribute;
      try {
        foundAttribute = await Attribute.findById(at.attributeId);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "something went wrong",
        });
      }

      if (!foundAttribute) {
        return res.status(500).json({
          success: false,
          message: `Attribute not found`,
        });
      }

      const attribute = {
        ...at,
        attribute: foundAttribute,
      };

      return attribute;
    });

    A = await Promise.all(requiredAttributes);
  }

  let updatedProduct;

  try {
    updatedProduct = await Product.findByIdAndUpdate(
      req.body._id,
      {
        ...req.body.data,
        brand: brand,
        tags: tags,
        taxClass: tax,
        categories: categories,
        relatedProducts: relatedProducts,
        upSells: upSells,
        crossSells: crossSells,
        attributes: A,
        baseImage: baseImage,
        additionalImages: additionalImages,
        downloads: downloads,
        // LeftQty: req.body.data.Qty || foundProduct.LeftQty,
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
    data: updatedProduct,
  });
};

exports.deleteProducts = (req, res) => {
  const id = req.body.id;

  Product.deleteMany({ _id: { $in: id } })
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

exports.filterProducts = (req, res) => {
  let {
    searchWord,
    sortBy,
    skipNumber,
    limitNumber,
    findFieldsInArray,
    priceL,
    priceH,
  } = req.body;

  if (!sortBy) sortBy = "-createdAt";

  let filter = {};
  if (searchWord) filter.name = { $regex: searchWord, $options: "i" };

  if (findFieldsInArray) {
    findFieldsInArray.forEach((field) => {
      filter[field.name] = { $in: field.value };
    });
  }
  if (priceL && priceH) filter.price = { $gte: priceL, $lte: priceH };

  console.log(filter);

  Product.find(filter)
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .lean()
    .populate("brand")
    .populate({ path: "tags" })
    .populate({ path: "categories" })
    .populate({ path: "attributes", populate: { path: "attribute" } })
    .populate({ path: "options" })
    .populate({ path: "relatedProducts" })
    .populate({ path: "upSells" })
    .populate({ path: "crossSells" })
    .populate({ path: "baseImage" })
    .populate({ path: "additionalImages" })
    .populate({ path: "downloads" })
    .then((product) => {
      // console.log(product);
      res.status(200).json({
        success: true,
        data: product,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
