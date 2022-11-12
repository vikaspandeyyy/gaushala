const FlashSale = require("../models/flashSaleModel");
const Product = require("../models/productModel");

exports.addFlashSale = async (req, res) => {
  const { campaignName, products } = req.body.data;

  if (!campaignName) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields e",
    });
  }

  let foundFlashSale;
  try {
    foundFlashSale = await FlashSale.findOne({ campaignName: campaignName });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundFlashSale) {
    return res.status(422).json({
      success: false,
      message: "This campaign name already exists",
    });
  }

  let requiredProducts;
  try {
    requiredProducts = products.map(async (pro) => {
      if (!pro.productId || !pro.endDate || !pro.price || !pro.quantity) {
        return undefined;
      }

      let foundProduct;
      try {
        foundProduct = await Product.findById(pro.productId);
      } catch (err) {
        return undefined;
      }

      if (!foundProduct) {
        return undefined;
      }

      const product = {
        ...pro,
        product: foundProduct,
      };

      return product;
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  console.log(requiredProducts);

  let P = await Promise.all(requiredProducts);

  P = P.filter((pro) => pro != null);

  let lastFlashSale = [];
  try {
    lastFlashSale = await FlashSale.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastFlashSale);

  const newId = lastFlashSale[0] ? lastFlashSale[0].ID + 1 : 1;

  const flashSale = new FlashSale({
    ...req.body.data,
    ID: newId || 1,
    products: P,
  });

  let addedFlashSale;
  try {
    addedFlashSale = await flashSale.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 7",
    });
  }

  return res.status(200).json({
    success: true,
    data: addedFlashSale,
  });
};

exports.getFlashSaleById = (req, res) => {
  FlashSale.findById(req.params.id)
    .populate({ path: "products", populate: { path: "product" } })
    .then((flashsale) => {
      return res.status(200).json({
        success: true,
        data: flashsale,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getFlashSales = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  FlashSale.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate({ path: "products", populate: { path: "product" } })
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

exports.searchFlashSales = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    FlashSale.find({ campaignName: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate({ path: "products", populate: { path: "product" } })
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

exports.editFlashSale = async (req, res) => {
  const { campaignName, products } = req.body.data;

  if (!campaignName) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields e",
    });
  }

  let foundFlashSale;
  try {
    foundFlashSale = await FlashSale.findOne({ campaignName: campaignName });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundFlashSale && foundFlashSale._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This campaign name already exists",
    });
  }

  const requiredProducts = products.map(async (pro) => {
    if (!pro.productId || !pro.endDate || !pro.price || !pro.quantity) {
      return res.status(500).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    let foundProduct;
    try {
      foundProduct = await Product.findById(pro.productId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundProduct) {
      return res.status(500).json({
        success: false,
        message: `Product not found`,
      });
    }

    const product = {
      ...pro,
      product: foundProduct,
    };

    return product;
  });

  const P = await Promise.all(requiredProducts);

  let updatedFlashSale;
  try {
    updatedFlashSale = await FlashSale.findByIdAndUpdate(
      req.body._id,
      {
        ...req.body.data,
        products: P,
      },
      { new: true }
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedFlashSale,
  });
};

exports.deleteFlashSale = (req, res) => {
  const id = req.body.id;

  FlashSale.deleteMany({ _id: { $in: id } })
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
