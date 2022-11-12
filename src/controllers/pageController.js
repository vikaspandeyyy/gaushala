const Page = require("../models/pageModel");

exports.addPage = async (req, res) => {
  const { name, body } = req.body.data;

  if (!name || !body) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundPageByName;
  try {
    foundPageByName = await Page.findOne({ name: req.body.data.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundPageByName) {
    return res.status(422).json({
      success: false,
      message: "This page name is already taken",
    });
  }

  let lastPage = [];
  try {
    lastPage = await Page.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  const newId = lastPage[0] ? lastPage[0].ID + 1 : 1;

  const url = name.toLowerCase().split(" ").join("-");
  console.log(url);
  const page = new Page({
    ...req.body.data,
    url,
    ID: newId || 1,
  });
  console.log(page);
  page
    .save()
    .then((addedPage) => {
      return res.status(200).json({
        success: true,
        data: addedPage,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getPageById = (req, res) => {
  Page.findById(req.params.id)
    .then((page) => {
      return res.status(200).json({
        success: true,
        data: page,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getPageByUrl = (req, res) => {
  Page.findOne({url: req.params.url})
    .then((page) => {
      return res.status(200).json({
        success: true,
        data: page,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getPages = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Page.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .then((pages) => {
      res.status(200).json({
        success: true,
        data: pages,
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

exports.searchPages = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Page.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .then((pages) => {
        return res.status(200).json({
          success: true,
          data: pages,
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

exports.editPage = async (req, res) => {
  let foundPageByName;
  try {
    foundPageByName = await Page.findOne({ name: req.body.data.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  console.log(foundPageByName);
  console.log(req.body._id);

  if (foundPageByName && foundPageByName._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tag name is already taken",
    });
  }

  let foundPageByUrl;
  try {
    foundPageByUrl = await Page.findOne({ url: req.body.data.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  console.log(foundPageByUrl);

  if (foundPageByUrl && foundPageByUrl._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tag url is already taken",
    });
  }

  Page.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
    },
    {
      new: true,
    }
  )
    .then((editedPage) => {
      return res.status(200).json({
        success: true,
        data: editedPage,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deletePage = (req, res) => {
  const id = req.body.id;

  Page.deleteMany({ _id: { $in: id } })
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
