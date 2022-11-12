const Account = require("../models/accountModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.addAccount = async (req, res) => {
  console.log(
    req.body.data.Email,
    req.body.data.Password,
    req.body.data.ConfirmPassword
  );
  if (
    !req.body.data.Email ||
    !req.body.data.Password ||
    !req.body.data.ConfirmPassword
  ) {
    return res.status(422).json({
      success: "false",
      message: "Please fill all the required fields",
    });
  }

  if (req.body.data.Password !== req.body.data.ConfirmPassword) {
    return res.status(422).json({
      success: "false",
      message: "Passwords don't match",
    });
  }

  let foundUser;
  try {
    foundUser = await Account.findOne({ Email: req.body.data.Email });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "something went wrong",
    });
  }

  if (foundUser) {
    return res.status(400).json({
      success: "false",
      message: "E-mail already exists",
    });
  }

  const newAccount = new Account({
    ...req.body.data,
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        success: "false",
        message: "something went wrong",
      });
    }
    bcrypt.hash(newAccount.Password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: "false",
          message: "already exists",
        });
      }

      const token = jwt.sign(
        {
          data: newAccount._id,
        },
        "secret",
        {}
      );

      console.log(hash);
      newAccount.token = token;
      newAccount.Password = hash;
      newAccount
        .save()
        .then((user) => {
          return res.status(200).json({
            success: "true",
            data: user,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            success: "false",
            message: "something went wrong",
          });
        });
    });
  });
};

exports.loginAccount = async (req, res) => {
  const { Email, Password } = req.body.data;
  if (!Email || !Password) {
    return res.status(422).json({
      success: "false",
      message: "Please fill all the required fields",
    });
  }

  let foundUser;
  try {
    foundUser = await Account.findOne({ Email: Email });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "something went wrong",
    });
  }

  if (!foundUser) {
    return res.status(422).json({
      success: "false",
      message: "Incorrect Email or Password",
    });
  }

  let doesMatched;
  try {
    doesMatched = await bcrypt.compare(Password, foundUser.Password);
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "something went wrong",
    });
  }

  if (!doesMatched) {
    return res.status(422).json({
      success: "false",
      message: "Incorrect Email or Password",
    });
  }

  return res.status(200).json({
    success: "true",
    data: foundUser,
  });
};

exports.getAccounts = (req, res) => {
  Account.find({})
    .select("-Password")
    .then((users) => {
      return res.status(200).json({
        success: "true",
        data: users,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: "false",
        message: "Something went wrong",
      });
    });
};
exports.getAccountById = (req, res) => {
  Account.findById(req.params.id)
    .select("-Password")
    .then((user) => {
      return res.status(200).json({
        success: "true",
        data: user,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: "false",
        message: "Something went wrong",
      });
    });
};

exports.editAccount = (req, res) => {
  const editKey = req.body._id ? req.body._id : req.user._id;
  Account.findByIdAndUpdate(
    req.body._id,
    {
      editKey,
    },
    {
      new: true,
    }
  )
    .then((user) => {
      return res.status(200).json({
        success: "true",
        data: user,
      });
    })
    .catch((err) => {
      {
        console.log(err);
        return res.status(500).json({
          success: "false",
          message: "Something went wrong",
        });
      }
    });
};
