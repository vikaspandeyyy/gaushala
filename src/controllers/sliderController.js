const Slide = require("../models/sliderModel");
const Media = require("../models/mediaModel");

exports.addSlide = async (req, res) => {
  const { Name } = req.body.data;
  const { slides } = req.body;

  if (!Name) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundSlide;
  try {
    foundSlide = await Slide.findOne({ Name: Name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundSlide) {
    return res.status(422).json({
      success: false,
      message: "This name is already taken",
    });
  }

  const Slides = slides.map(async (slide) => {
    // if (!slide.imageId) {
    //   return res.status(422).json({
    //     success: false,
    //     message: "Please upload image",
    //   });
    // }

    let foundMedia;
    try {
      foundMedia = await Media.findById(slide.imageId);
    } catch (err) {
      return null;
    }

    if (!foundMedia) {
      return null;
    }

    const Slide = {
      ...slide,
      Image: foundMedia,
    };

    return Slide;
  });

  let S = await Promise.all(Slides);
  S = S.filter((s) => s != null);

  let lastSlide = [];
  try {
    lastSlide = await Slide.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  console.log(lastSlide);

  const newId = lastSlide[0] ? lastSlide[0].ID + 1 : 1;

  const slide = new Slide({
    ...req.body.data,
    ID: newId || 1,
    Slides: S,
  });
  // console.log(tax);
  slide
    .save()
    .then((addedSlide) => {
      return res.status(200).json({
        success: true,
        data: addedSlide,
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

exports.getSlideById = (req, res) => {
  Slide.findById(req.params.id)
    .populate({ path: "Slides", populate: { path: "Image" } })
    .then((slide) => {
      return res.status(200).json({
        success: true,
        data: slide,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getSlides = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Slide.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate({ path: "Slides", populate: { path: "Image" } })
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

exports.searchSlides = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Slide.find({ Name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate({ path: "Slides", populate: { path: "Image" } })
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

exports.editSlides = async (req, res) => {
  const { Name } = req.body.data;
  const { slides } = req.body;

  if (!Name) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundSlide;
  try {
    foundSlide = await Slide.findOne({ Name: Name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundSlide && foundSlide._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This name is already taken",
    });
  }

  const Slides = slides.map(async (slide) => {
    // if (!slide.imageId) {
    //   return res.status(422).json({
    //     success: false,
    //     message: "Please upload image",
    //   });
    // }

    let foundMedia;
    try {
      foundMedia = await Media.findById(slide.imageId);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundMedia) {
      res.status(500).json({
        success: false,
        message: `Media not found`,
      });
    }

    const Slide = {
      ...slide,
      Image: foundMedia,
    };

    return Slide;
  });

  const S = await Promise.all(Slides);

  Slide.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
      Slides: S,
    },
    {
      new: true,
    }
  )
    .then((editedSlide) => {
      return res.status(200).json({
        success: true,
        data: editedSlide,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteSlides = (req, res) => {
  const id = req.body.id;

  Slide.deleteMany({ _id: { $in: id } })
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
