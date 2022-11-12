const AttributeSet = require("../models/attributeSetModel");

exports.addAttributeSet = async (req, res) => {
  const { name } = req.body.data;
  if (!name) {
    return res.status(422).json({
      success: false,
      message: "Please fill the required fields",
    });
  }

  let lastAttributeSet = [];
  try {
    lastAttributeSet = await AttributeSet.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastAttributeSet);

  const newId = lastAttributeSet[0] ? lastAttributeSet[0].ID + 1 : 1;

  const attributeSet = new AttributeSet({
    ...req.body.data,
    ID: newId || 1,
  });

  attributeSet
    .save()
    .then((addedAttributeSet) => {
      return res.status(200).json({
        success: true,
        data: addedAttributeSet,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getAttributeSetById = (req, res) => {
  AttributeSet.findById(req.params.id)
    .then((attributeSet) => {
      return res.status(200).json({
        success: true,
        data: attributeSet,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getAttributeSet = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  AttributeSet.find()
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

exports.searchAttributeSets = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    AttributeSet.find({ name: { $regex: searchWord } })
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

exports.editAttributeSet = (req, res) => {
  AttributeSet.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
    },
    {
      new: true,
    }
  )
    .then((editedAttributeSet) => {
      return res.status(200).json({
        success: true,
        data: editedAttributeSet,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteAttributeSet = (req, res) => {
  const id = req.body.id;

  AttributeSet.deleteMany({ _id: { $in: id } })
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
