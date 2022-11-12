const Tax = require("../models/taxModel2");

exports.addTax = async (req, res) => {
  const { taxClass, basedOn } = req.body.data;

  if (!taxClass) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundTax;
  try {
    foundTax = await Tax.findOne({ taxClass: req.body.data.taxClass });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundTax) {
    return res.status(422).json({
      success: false,
      message: "This tax class is already taken",
    });
  }

  let lastTax = [];
  try {
    lastTax = await Tax.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  const newId = lastTax[0] ? lastTax[0].ID + 1 : 1;

  const tax = new Tax({
    ...req.body.data,
    ID: newId || 1,
  });
  // console.log(tax);
  tax
    .save()
    .then((addedTax) => {
      return res.status(200).json({
        success: true,
        data: addedTax,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 6",
      });
    });
};

exports.getTax = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Tax.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .then((tax) => {
      res.status(200).json({
        success: true,
        data: tax,
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

exports.searchTax = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Tax.find({ taxClass: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .then((tax) => {
        return res.status(200).json({
          success: true,
          data: tax,
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

exports.getTaxById = (req, res) => {
  Tax.findById(req.params.id)
    .then((tax) => {
      return res.status(200).json({
        success: true,
        data: tax,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.editTax = async (req, res) => {
  let foundTax;
  try {
    foundTax = await Tax.findOne({ taxClass: req.body.data.taxClass });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundTax && foundTax._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tax taxClass is already taken",
    });
  }

  Tax.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
    },
    {
      new: true,
    }
  )
    .then((editedTax) => {
      return res.status(200).json({
        success: true,
        data: editedTax,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteTax = (req, res) => {
  const id = req.body.id;

  Tax.deleteMany({ _id: { $in: id } })
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
