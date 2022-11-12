const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Tag = require("../models/tagModel");

exports.addReview = async (req, res) => {
  const { productId } = req.body;
  const userId = req.body._id ? req.body._id : req.user._id;

  if (
    !req.body.data.rating ||
    !req.body.data.reviewerName ||
    !req.body.data.comment
  ) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  if (!productId) {
    return res.status(422).json({
      success: false,
      message: "Couldn't recongnise product",
    });
  }
  if (!userId) {
    return res.status(422).json({
      success: false,
      message: "Couldn't find user",
    });
  }

  let product,
    productCount,
    sumRating = 0;
  try {
    product = await Product.findById(productId);
    productCount = await Review.find({ product: productId }).count();
    allReview = await Review.find({ product: productId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 2",
    });
  }
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "This product doesn't exists",
    });
  }

  allReview.forEach((review) => (sumRating += review.rating));

  // console.log(productCount);
  // console.log((sumRating));
  // console.log((Number(req.body.data.rating)));
  // console.log(Number(req.body.data.rating) + sumRating);
  // console.log((Number(req.body.data.rating)+ sumRating) / (productCount + 1));
  const newRating =
    (sumRating + Number(req.body.data.rating)) / (productCount + 1);
  product.rating = newRating;
  product.reviews = product.reviews + 1;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 2",
    });
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "This user doesn't exists",
    });
  }

  let lastReview = [];
  try {
    lastReview = await Review.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastReview);

  const newId = lastReview[0] ? lastReview[0].ID + 1 : 1;

  const review = new Review({
    ...req.body.data,
    ID: newId || 1,
    product,
    user,
  });

  let addedReview, savedProduct;

  try {
    addedReview = await review.save();
    savedProduct = await product.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  return res.status(200).json({
    success: true,
    data: addedReview,
  });
};

exports.getReviewById = (req, res) => {
  Review.findById(req.params.id)
    .populate({ path: "product" })
    .then((review) => {
      //   console.log(review);
      res.status(200).json({
        success: true,
        data: review,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getReviews = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = "-createdAt";
  Review.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate({ path: "product" })
    .then((reviw) => {
      res.status(200).json({
        success: true,
        data: reviw,
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

exports.searchReviews = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = "-createdAt";
  if (searchWord) {
    Review.find({ reviewerName: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate({ path: "product" })
      .then((reviw) => {
        return res.status(200).json({
          success: true,
          data: reviw,
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

exports.getReviewByUser = (req, res) => {
  // const userId = use;

  Review.find({ user: req.params.userId })
    .populate({ path: "product" })
    .then((review) => {
      //   console.log(review);
      res.status(200).json({
        success: true,
        data: review,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getReviewByProduct = (req, res) => {
  // const userId = use;

  Review.find({ product: req.params.productId })
    .populate({ path: "product" })
    .then((review) => {
      //   console.log(review);
      res.status(200).json({
        success: true,
        data: review,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.editReview = async (req, res) => {
  // const { productId } = req.body;

  // let product;
  // try {
  //   product = await Product.findById(productId);
  // } catch (err) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "something went wrong 2",
  //   });
  // }

  // if (!product) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "This product doesn't exists",
  //   });
  // }

  let updatedReview;

  try {
    updatedReview = await Review.findByIdAndUpdate(req.body._id, {
      ...req.body.data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedReview,
  });
};

exports.deleteReviews = (req, res) => {
  const id = req.body.id;
  console.log(id);

  Review.deleteMany({ _id: { $in: id } })
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
