const Banner = require("../models/bannerModel");

exports.addBanner = async (req, res) => {
  const banner = new Banner({
    ...req.body.data,
  });

  banner
    .save()
    .then((addedBanner) => {
      return res.status(200).json({
        success: true,
        data: addedBanner,
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

exports.getBlogById = (req, res) => {
  Banner.findById(req.params.id)
    // .populate("banner")
    .populate({
      path: "banners",
      populate: [{ path: "img" }, { path: "smallimg" }],
    })
    // .populate("smallImg")
    .then((banner) => {
      return res.status(200).json({
        success: true,
        data: banner,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getBlogs = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Banner.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    // .populate("img")
    // .populate("smallImg")
    .populate({
      path: "banners",
      populate: [{ path: "img" }, { path: "smallimg" }],
    })
    .then((banner) => {
      res.status(200).json({
        success: true,
        data: banner,
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

exports.editBanner = async (req, res) => {
  Banner.findByIdAndUpdate(
    req.body.id,
    {
      ...req.body.data,
    },
    { new: true }
  )
    .then((addedBanner) => {
      return res.status(200).json({
        success: true,
        data: addedBanner,
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

exports.deleteBanner = (req, res) => {
  const id = req.body.id;

  Banner.deleteMany({ _id: { $in: id } })
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
