const Attribute = require("../models/attributeModel");
const AttributeSet = require("../models/attributeSetModel");
const Category = require("../models/categoryModel");

exports.addAttribute = async (req, res) => {
  const { name, attributeSetId } = req.body.data;
  const { categoryIds } = req.body;
  if (!name || !attributeSetId) {
    return res.status(422).json({
      success: false,
      message: "Please fill the required fields",
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

  let lastAttribute = [];
  try {
    lastAttribute = await Attribute.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastAttributeSet);

  const newId = lastAttribute[0] ? lastAttribute[0].ID + 1 : 1;

  Attribute.findOne({ name: name })
    .then((foundAttribute) => {
      if (foundAttribute) {
        return res.status(422).json({
          success: false,
          message: "Attribute already exists",
        });
      }

      AttributeSet.findById(attributeSetId)
        .then((foundAttributeSet) => {
          if (!foundAttributeSet) {
            return res.status(404).json({
              success: false,
              message: "Attribute Set doesn't exists",
            });
          }

          const attribute = new Attribute({
            ...req.body.data,
            attributeSet: foundAttributeSet,
            categories: categories,
            ID: newId || 1,
          });

          attribute
            .save()
            .then((addedAttribute) => {
              return res.status(200).json({
                success: true,
                data: addedAttribute,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: false,
                message: "something went wrong",
              });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "something went wrong",
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getAttributeById = (req, res) => {
  Attribute.findById(req.params.id)
    .then((attribute) => {
      if (!attribute) {
        return res.status(404).json({
          success: false,
          message: "Attribute not found",
        });
      }
      return res.status(200).json({
        success: true,
        data: attribute,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getAttribute = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Attribute.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate("attributeSet", "_id name")
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

exports.searchAttributes = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Attribute.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate("attributeSet", "_id name")
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

exports.editAttribute = async (req, res) => {
  const { name, attributeSetId } = req.body.data;
  const { categoryIds } = req.body;
  console.log(req.body);

  if (!categoryIds) {
    return res.status(500).json({
      success: false,
      message: "More information required",
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

  Attribute.findOne({ name: name })
    .then((foundAttribute) => {
      if (foundAttribute && foundAttribute._id != req.body._id) {
        return res.status(404).json({
          success: false,
          message: "Attribute is already taken",
        });
      }
      AttributeSet.findById(attributeSetId)
        .then((foundAttributeSet) => {
          if (!foundAttributeSet) {
            return res.status(404).json({
              success: false,
              message: "Attribute Set doesn't exists",
            });
          }
          Attribute.findByIdAndUpdate(
            req.body._id,
            {
              ...req.body.data,
              attributeSet: foundAttributeSet,
              categories: categories,
            },
            {
              new: true,
            }
          )
            .then((editedAttribute) => {
              return res.status(200).json({
                success: true,
                data: editedAttribute,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: false,
                message: "something went wrong",
              });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "something went wrong",
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteAttribute = (req, res) => {
  const id = req.body.id;

  Attribute.deleteMany({ _id: { $in: id } })
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
