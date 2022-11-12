const fs = require("fs");

const Media = require("../models/mediaModel");

exports.addMedia = async (req, res) => {
  let lastMedia = [];
  try {
    lastMedia = await Media.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastMedia);

  const newId = lastMedia[0] ? lastMedia[0].ID + 1 : 1;

  const media = new Media({
    image: req.file.path,
    ID: newId || 1,
    fileName: req.file.filename,
  });

  media
    .save()
    .then((addedMedia) => {
      return res.status(200).json({
        success: true,
        data: addedMedia,
      });
    })
    .catch((err) => {
      console.log(err);
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          console.log(err);
        });
      }
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getMediaById = (req, res) => {
  Media.findById(req.params.id)
    .then((media) => {
      return res.status(200).json({
        success: true,
        data: media,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getMedias = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Media.find()
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

exports.searchMedias = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Media.find({ fileName: { $regex: searchWord } })
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

exports.deleteMedia = async (req, res) => {
  const id = req.body.id;

  // let count = 0;

  let deleteMedia = [];

  try {
    deleteMedia = await Media.find({ _id: { $in: id } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (!deleteMedia) {
    return res.status(500).json({
      success: false,
      message: "Can't find media with these ids",
    });
  }

  let data;

  try {
    data = await Media.deleteMany({ _id: { $in: id } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  deleteMedia.forEach((media) => {
    fs.unlink(media.image, (err) => {
      console.log(err);
    });
  });

  return res.status(200).json({
    success: true,
    data,
  });
};
