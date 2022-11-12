const Option = require("../models/optionsModel");

exports.addOption = async (req, res) => {
  let lastOption = [];
  try {
    lastOption = await Option.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastOption);

  const newId = lastOption[0] ? lastOption[0].ID + 1 : 1;

  const option = new Option({
    ...req.body.data,
    ID: newId || 1,
  });

  option
    .save()
    .then((addedOption) => {
      return res.status(200).json({
        success: true,
        data: addedOption,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getOptionById = (req, res) => {
  Option.findById(req.params.id)
    .then((option) => {
      return res.status(200).json({
        success: true,
        data: option,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getOptions = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Option.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .then((options) => {
      res.status(200).json({
        success: true,
        data: options,
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

exports.searchOptions = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Option.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .then((options) => {
        return res.status(200).json({
          success: true,
          data: options,
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

exports.editOption = (req, res) => {
  Option.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
    },
    {
      new: true,
    }
  )
    .then((editedOption) => {
      return res.status(200).json({
        success: true,
        data: editedOption,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteOption = (req, res) => {
  const id = req.body.id;

  Option.deleteMany({ _id: { $in: id } })
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
