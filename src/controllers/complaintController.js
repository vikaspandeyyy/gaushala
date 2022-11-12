const Complaint = require("../models/complaintModel");

exports.addComplaint = async (req, res) => {
  // if (!Email || !FullName || !Body) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Please fill all the required fields",
  //   });
  // }
  let lastComplaint = [];
  try {
    lastComplaint = await Complaint.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  const newId = lastComplaint[0] ? lastComplaint[0].ID + 1 : 1;

  console.log(req.files);

  const complaint = new Complaint({
    Image: req.files,
    User: req.user,
    ...req.body,
    ID: newId || 1,
  });

  console.log(complaint);
  complaint
    .save()
    .then((addedComplaint) => {
      return res.status(200).json({
        success: true,
        data: addedComplaint,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getComplaintById = (req, res) => {
  Complaint.findById(req.params.id)
    .populate("OrderId")
    .populate("User")
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

exports.getComplaintUser = (req, res) => {
  Complaint.find({ User: req.params.id })
    .populate("OrderId")
    .populate("User")
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

exports.getComplaints = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Complaint.find()
    .populate("User")
    .populate("OrderId")
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

exports.editComplaint = async (req, res) => {
  Complaint.findByIdAndUpdate(
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

//   Complaint.deleteMany({ _id: { $in: id } })
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
