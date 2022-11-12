const Product = require("../models/productModel");
const Stock = require("../models/stockModel");

exports.createStocks = async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  // let foundOptions;
  // try {
  //   foundOptions = await Stock.find({ product: req.body.productId });
  // } catch (err) {
  //   // console.log(err);
  //   return res.status(500).json({
  //     success: false,
  //     message: "something went wrong",
  //   });
  // }

  let delteOptions;
  try {
    delteOptions = await Stock.deleteMany({ product: req.body.productId });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let options = [];
  product.options.forEach((option) => {
    if (!options.length) {
      if (!option.value[0].label) options.push(option.name);
      else {
        option.value.forEach((val) => options.push(val.label));
      }
    } else {
      let newOptions = [];
      options.forEach((op) => {
        if (!option.value[0].label) {
          let newOp = option.name;
          newOptions.push(op + "-" + newOp);
        } else {
          option.value.forEach((val) => newOptions.push(op + "-" + val.label));
        }
      });
      options = newOptions;
    }
    console.log(options);
  });

  console.log(options);

  const createdStock = options.map(async (op) => {
    const stock = new Stock({
      product,
      name: op,
    });
    let savedStock;
    try {
      savedStock = await stock.save();
    } catch (err) {
      return {
        success: false,
        message: "something went wrong",
      };
    }

    return { success: true, data: savedStock };
  });

  const stocks = await Promise.all(createdStock);

  return res.status(200).json({
    success: true,
    data: stocks,
  });
};

exports.addStocks = async (req, res) => {
  const { newOptions } = req.body;
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let foundOptions;
  try {
    foundOptions = await Stock.find({ product: req.body.productId });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let options = foundOptions.map((op) => op.name);
  console.log(product.options);

  newOptions.forEach((option) => {
    if (!options.length) {
      if (!option.value[0].label) options.push(option.name);
      else {
        option.value.forEach((val) => options.push(val.label));
      }
    } else {
      let newOptions = [];
      options.forEach((op) => {
        if (!option.value[0].label) {
          let newOp = option.name;
          newOptions.push(op + "-" + newOp);
        } else {
          option.value.forEach((val) => newOptions.push(op + "-" + val.label));
        }
      });
      options = newOptions;
    }
    console.log(options);
  });
  console.log(options);

  let delteOptions;
  try {
    delteOptions = await Stock.deleteMany({ product: req.body.productId });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  const createdStock = options.map(async (op) => {
    const stock = new Stock({
      product,
      name: op,
    });
    let savedStock;
    try {
      savedStock = await stock.save();
    } catch (err) {
      return {
        success: false,
        message: "something went wrong",
      };
    }

    return { success: true, data: savedStock };
  });

  const stocks = await Promise.all(createdStock);

  console.log(stocks);
  return res.status(200).json({
    success: true,
    data: stocks,
  });
};

exports.addStockValue = async (req, res) => {
  const { stocks } = req.body;

  const updatedStocks = stocks.map(async (stock) => {
    let updatedStock;
    try {
      updatedStock = await Stock.findByIdAndUpdate(
        stock.stockId,
        { qty: stock.qty, price: stock.price },
        { new: true }
      );
    } catch (err) {
      return { success: false, message: "something went wrong" };
    }
    return { success: true, data: updatedStock };
  });

  const Stocks = await Promise.all(updatedStocks);

  console.log(Stocks);
  return res.status(200).json({
    success: true,
    data: Stocks,
  });
};

exports.getStockByProduct = (req, res) => {
  Stock.find({ product: req.body.productId })
    .then((data) => {
      return res.status(200).json({
        success: true,
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    });
};

exports.getStockById = (req, res) => {
  Stock.findById(req.params.id)
    .then((data) => {
      return res.status(200).json({
        success: true,
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    });
};
