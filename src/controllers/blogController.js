const Blog = require("../models/blogModel");
const Media = require("../models/mediaModel");

exports.addBlog = async (req, res) => {
  const { heading, body } = req.body.data;

  if (!heading || !body) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let img;
  if (req.body.img) {
    try {
      img = await Media.findById(req.body.img);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!img) {
      return res.status(422).json({
        success: false,
        message: "This media doesn't exists",
      });
    }
  }

  let foundBrandByUrl;
  try {
    foundBrandByUrl = await Blog.findOne({ url: req.body.data.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundBrandByUrl) {
    return res.status(422).json({
      success: false,
      message: "This tag url is already taken",
    });
  }

  const blog = new Blog({
    ...req.body.data,
    img,
    user: req.user,
  });

  blog
    .save()
    .then((addedBlog) => {
      return res.status(200).json({
        success: true,
        data: addedBlog,
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
  Blog.findById(req.params.id)
    .populate("img")
    .populate("user")
    .then((blog) => {
      return res.status(200).json({
        success: true,
        data: blog,
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
  Blog.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate("img")
    .populate("user")
    .then((blogs) => {
      res.status(200).json({
        success: true,
        data: blogs,
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

exports.searchBlogs = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Blog.find({ heading: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate("img")
      .then((blogs) => {
        return res.status(200).json({
          success: true,
          data: blogs,
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

exports.editBlog = async (req, res) => {
  let img;
  if (req.body.img) {
    try {
      img = await Media.findById(req.body.img);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!img) {
      return res.status(422).json({
        success: false,
        message: "This media doesn't exists",
      });
    }
  }

  let foundBrandByUrl;
  try {
    foundBrandByUrl = await Blog.findOne({ url: req.body.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundBrandByUrl && foundBrandByUrl._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tag url is already taken",
    });
  }

  Blog.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
      img: img,
    },
    {
      new: true,
    }
  )
    .then((editedBlog) => {
      return res.status(200).json({
        success: true,
        data: editedBlog,
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

exports.deleteBlog = (req, res) => {
  const id = req.body.id;

  Blog.deleteMany({ _id: { $in: id } })
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
