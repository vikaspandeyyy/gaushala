const Query = require("../models/queryModel");

exports.addQuery = async (req, res) => {
  let lastQuery = [];
  try {
    lastQuery = await Query.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastQuery);

  const newId = lastQuery[0] ? lastQuery[0].ID + 1 : 1;

  const query = new Query({
    // Image: req.file.path,
    ID: newId || 1,
    ...req.body,
    // User: req.user
  });

  query
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

exports.getQueryById = (req, res) => {
  Query.findById(req.params.id)
    .populate("OrderId")
    .then((query) => {
      return res.status(200).json({
        success: true,
        data: query,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getQueries = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Query.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .then((queries) => {
      res.status(200).json({
        success: true,
        data: queries,
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

exports.editQuery = async (req, res) => {
  Query.findByIdAndUpdate(
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

// exports.deletePage = (req, res) => {
//   const id = req.body.id;

//   Query.deleteMany({ _id: { $in: id } })
//     .then((data) => {
//       return res.status(200).json({
//         success: "true",
//         data: {
//           data,
//         },
//       });
//     })
//     .catch((err) => {
//       return res.status(500).json({
//         success: false,
//         message: "something went wrong",
//       });
//     });
// };
