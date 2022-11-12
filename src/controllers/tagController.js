const Tag = require("../models/tagModel");

exports.addTag = async (req, res) => {
  const { name } = req.body.data;

  if (!name) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundTagByName;
  try {
    foundTagByName = await Tag.findOne({ name: req.body.data.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundTagByName) {
    return res.status(422).json({
      success: false,
      message: "This tag name is already taken",
    });
  }

  let lastTag = [];
  try {
    lastTag = await Tag.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastTag);

  const newId = lastTag[0] ? lastTag[0].ID + 1 : 1;

  const url = name.toLowerCase().split(" ").join("-");
  console.log(url);
  const tag = new Tag({
    ...req.body.data,
    ID: newId || 1,
    url,
  });
  console.log(tag);
  tag
    .save()
    .then((addedTag) => {
      return res.status(200).json({
        success: true,
        data: addedTag,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getTag = (req, res) => {
  Tag.find()
    .then((tag) => {
      res.status(200).json({
        success: true,
        data: tag,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getTagById = (req, res) => {
  Tag.findById(req.params.id)
    .then((tag) => {
      return res.status(200).json({
        success: true,
        data: tag,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getTags = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Tag.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .then((tags) => {
      res.status(200).json({
        success: true,
        data: tags,
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

exports.searchTags = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Tag.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .then((tags) => {
        return res.status(200).json({
          success: true,
          data: tags,
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

exports.editTag = async (req, res) => {
  let foundTagByName;
  try {
    foundTagByName = await Tag.findOne({ name: req.body.data.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundTagByName && foundTagByName._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tag name is already taken",
    });
  }

  let foundTagByUrl;
  try {
    foundTagByUrl = await Tag.findOne({ url: req.body.data.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundTagByUrl && foundTagByUrl._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tag url is already taken",
    });
  }

  Tag.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
    },
    {
      new: true,
    }
  )
    .then((editedTag) => {
      return res.status(200).json({
        success: true,
        data: editedTag,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteTag = (req, res) => {
  const id = req.body.id;

  Tag.deleteMany({ _id: { $in: id } })
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
