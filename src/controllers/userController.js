const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const Setting = require("../models/settingModel");
const { mailCreateTransport } = require("./mailController");
const crypto = require("crypto");

// const SMTPServer = require("smtp-server").SMTPServer;

const getKeysFromSettings = async (type) => {
  let data;
  try {
    data = await Setting.find({});
  } catch (err) {
    console.log(err);
  }
  console.log(data[0]["Mail"]);
  return data[0][type];
};

exports.addUser = async (req, res) => {
  const output = `<div><h1>Welcome!</h1><p>Welcome</p></div>`;
  // const testAccount = await nodemailer.createTestAccount();
  const Mail = await getKeysFromSettings("Mail");

  // console.log(testAccount);
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let transporter;
  // if (Mail.WelcomeEmail) {
  //   try{
  //     transporter = mailCreateTransport(Mail);

  //   }catch(err){
  //     console.log(err);
  //   }

  //   // transporter = nodemailer.createTransport({
  //   //   // host: Mail.MailHost,
  //   //   // port: Mail.MailPort,
  //   //   host: "smtp.gmail.com",
  //   //   port: "587",
  //   //   secure: false, // true for 465, false for other ports
  //   //   auth: {
  //   //     user: "lokostop123@gmail.com", // generated ethereal user
  //   //     pass: "loko@123", // generated ethereal password
  //   //   },
  //   // });
  // }

  let user;
  try {
    user = await User.findOne({
      Email: req.body.data.Email,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "Something went wrong 1",
    });
  }

  if (user) {
    // console.log(user);
    return res.status(400).json({
      success: "false",
      message: "E-mail already exists 2",
    });
  }

  let roles;
  let RequiredPermissions;
  if (!req.body.isCustomer) {
    try {
      roles = await Role.find({
        _id: req.body.RoleIds,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: "false",
        message: "Something went wrong 3",
      });
    }

    let requiredRolesPermissions = req.body.data.Permissions.map((per, i) => {
      let permission = "Deny";

      if (
        req.body.data.Permissions[i].value == "Allow" ||
        req.body.data.Permissions[i].value == "Deny"
      ) {
        permission = req.body.data.Permissions[i].value;
      } else {
        roles.forEach((role) => {
          if (role.Permissions[i].value == "Allow") permission = "Allow";
          if (permission === "Allow") return;
        });
      }

      const P = {
        name: req.body.data.Permissions[i].name,
        value: permission,
      };

      return P;

      // requiredRolesPermissions.push(P);
      // console.log(requiredRolesPermissions);
    });

    console.log(requiredRolesPermissions);

    RequiredPermissions = await Promise.all(requiredRolesPermissions);
  } else {
    try {
      roles = await Role.find({ Name: "Customer" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: "false",
        message: "Something went wrong 3",
      });
    }

    RequiredPermissions = roles[0].Permissions;
  }

  let lastUser = [];
  try {
    lastUser = await User.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  console.log(lastUser);

  const newId = lastUser[0] ? lastUser[0].ID + 1 : 1;

  const newUser = new User({
    ...req.body.data,
    Roles: roles,
    ID: newId || 1,
    Permissions: RequiredPermissions,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.Password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: "false",
          message: "already exists",
        });
      }
      const token = jwt.sign(
        {
          data: newUser._id,
        },
        "secret",
        {}
      );
      newUser.token = token;
      newUser.Password = hash;

      // console.log("1");
      // console.log(newUser);
      newUser
        .save()
        .then(async (user) => {
          // send mail with defined transport object
          // if (Mail.WelcomeEmail) {
          //   let info;
          //   try {
          //     info = await transporter.sendMail({
          //       from: `${Mail.MailFromName} <${Mail.MailFromAddress}> `, // sender address
          //       // from: `${Mail.MailFromName} <noreply@lokostop.in> `, // sender address
          //       to: user.Email, // list of receivers
          //       subject: "Hello ✔", // Subject line
          //       text: "Hello world?", // plain text body
          //       html: "<b>Hello world?</b>", // html body
          //     });
          //   } catch (err) {
          //     return console.log(err);
          //   }

          //   console.log("Message sent: %s", info.messageId);
          //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          //   // Preview only available when sending through an Ethereal account
          //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          // }

          return res.status(200).json({
            success: "true",
            data: user,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            success: "false",
            message: "something went wrong 4",
          });
        });
    });
  });
};

exports.loginUser = (req, res) => {
  const { Email, Password } = req.body.data;

  User.findOne({ Email: Email }).then((user) => {
    if (!user) {
      return res.status(422).json({
        success: "false",
        message: "Incorrect Email or Password",
      });
    }
    bcrypt
      .compare(Password, user.Password)
      .then((doesMatched) => {
        if (!doesMatched) {
          return res.status(422).json({
            success: "false",
            message: "Incorrect Email or Password",
          });
        }

        user.LastLogin = new Date();
        user
          .save()
          .then((updatedUser) => {
            if (!updatedUser) {
              return res.status(500).json({
                success: "false",
                message: "Something went wrong",
              });
            }
            res.status(200).json({
              success: "true",
              data: user,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              success: "false",
              message: "Something went wrong",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: "false",
          message: "Something went wrong",
        });
      });
  });
};

exports.getUserById = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { Cart: { product: null } },
      },
      { new: true }
    );
  } catch (err) {
    return res.status(500).json({
      success: "false",
      message: "Something went wrong",
    });
  }
  User.findById(req.params.id)
    .populate("Wishlist")
    .populate({
      path: "Cart",
      populate: [{ path: "product" }, { path: "stock" }],
    })
    .populate("Orders")
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

exports.getUsers = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  User.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate("Wishlist")
    .populate({
      path: "Cart",
      populate: [{ path: "product" }, { path: "stock" }],
    })
    .populate("Orders")
    .select("-Password")
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

exports.searchUsers = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    User.find({ "First Name": { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate("Wishlist")
      .populate({
        path: "Cart",
        populate: [{ path: "product" }, { path: "stock" }],
      })
      .populate("Orders")
      .select("-Password")
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

exports.editUser = async (req, res) => {
  const editKey = req.user._id;

  let RequiredPermissions = req.user.Permissions;
  let roles;
  if (req.body.RoleIds && !req.user.isCustomer) {
    try {
      roles = await Role.find({
        _id: req.body.RoleIds,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: "false",
        message: "Something went wrong 3",
      });
    }
    let Permissions = req.user.Permissions;
    if (req.body.data.Permissions) {
      Permissions = req.body.data.Permissions;
    }
    let requiredRolesPermissions = Permissions.map((per, i) => {
      let permission = "Deny";

      if (Permissions[i].value == "Allow" || Permissions[i].value == "Deny") {
        permission = Permissions[i].value;
      } else {
        roles.forEach((role) => {
          if (role.Permissions[i].value == "Allow") permission = "Allow";
          if (permission === "Allow") return;
        });
      }

      const P = {
        name: Permissions[i].name,
        value: permission,
      };

      return P;

      // requiredRolesPermissions.push(P);
      // console.log(requiredRolesPermissions);
    });

    console.log(requiredRolesPermissions);

    RequiredPermissions = await Promise.all(requiredRolesPermissions);
  }

  let foundUser = req.user;

  if (req.body.newPassword) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            success: "false",
            message: "already exists",
          });
        }
        const token = jwt.sign(
          {
            data: foundUser._id,
          },
          "secret",
          {}
        );
        foundUser.token = token;
        foundUser.Password = hash;

        // console.log("1");
        // console.log(newUser);
        foundUser
          .save()
          .then((user) => {
            // return res.status(200).json({
            //   success: "true",
            //   data: user,
            // });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              success: "false",
              message: "something went wrong 4",
            });
          });
      });
    });
  }
  if (!req.body.RoleIds || req.body.RoleIds.length == 0) roles = null;

  User.findByIdAndUpdate(
    editKey,
    {
      ...req.body.data,
      Permisons: RequiredPermissions,
      Email: foundUser.Email,
      Password: foundUser.Password,
      Roles: roles || foundUser.Roles,
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

exports.deleteUser = (req, res) => {
  const id = req.body.id;

  User.deleteMany({ _id: { $in: id } })
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

exports.createAdminUser = async () => {
  let lastUser = [];
  try {
    lastUser = await User.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  console.log(lastUser);

  const newId = lastUser[0] ? lastUser[0].ID + 1 : 1;

  const newUser = new User({
    "First Name": "admin",
    "Last Name": "admin",
    Email: "admin@admin.com",
    Password: "admin",
    ID: newId || 1,
    Permissions: [
      {
        name: "Index Attributes",
        value: "Allow",
      },
      {
        name: "Create Attributes",
        value: "Allow",
      },
      {
        name: "Edit Attributes",
        value: "Allow",
      },
      {
        name: "Delete Attributes",
        value: "Allow",
      },
      {
        name: "Index Attribute Set",
        value: "Allow",
      },
      {
        name: "Create Attribute Set",
        value: "Allow",
      },
      {
        name: "Edit Attribute Set",
        value: "Allow",
      },
      {
        name: "Delete Attribute Set",
        value: "Allow",
      },
      {
        name: "Index Brand",
        value: "Allow",
      },
      {
        name: "Create Brand",
        value: "Allow",
      },
      {
        name: "Edit Brand",
        value: "Allow",
      },
      {
        name: "Delete Brand",
        value: "Allow",
      },
      {
        name: "Index Categories",
        value: "Allow",
      },
      {
        name: "Create Categories",
        value: "Allow",
      },
      {
        name: "Edit Categories",
        value: "Allow",
      },
      {
        name: "Delete Categories",
        value: "Allow",
      },
      {
        name: "Index Coupons",
        value: "Allow",
      },
      {
        name: "Create Coupons",
        value: "Allow",
      },
      {
        name: "Edit Coupons",
        value: "Allow",
      },
      {
        name: "Delete Coupons",
        value: "Allow",
      },
      {
        name: "Index Currency Rates",
        value: "Allow",
      },
      {
        name: "Edit Currency Rates",
        value: "Allow",
      },
      {
        name: "Index Flash Sales",
        value: "Allow",
      },
      {
        name: "Create Flash Sales",
        value: "Allow",
      },
      {
        name: "Edit Flash Sales",
        value: "Allow",
      },
      {
        name: "Delete Flash Sales",
        value: "Allow",
      },
      {
        name: "Index Import",
        value: "Allow",
      },
      {
        name: "Create Import",
        value: "Allow",
      },
      {
        name: "Index Media",
        value: "Allow",
      },
      {
        name: "Create Media",
        value: "Allow",
      },
      {
        name: "Delete Media",
        value: "Allow",
      },
      {
        name: "Index Menus",
        value: "Allow",
      },
      {
        name: "Create Menus",
        value: "Allow",
      },
      {
        name: "Edit Menus",
        value: "Allow",
      },
      {
        name: "Delete Menus",
        value: "Allow",
      },
      {
        name: "Index Menu Items",
        value: "Allow",
      },
      {
        name: "Create Menu Items",
        value: "Allow",
      },
      {
        name: "Edit Menu Items",
        value: "Allow",
      },
      {
        name: "Delete Menu Items",
        value: "Allow",
      },
      {
        name: "Index Options",
        value: "Allow",
      },
      {
        name: "Create Options",
        value: "Allow",
      },
      {
        name: "Edit Options",
        value: "Allow",
      },
      {
        name: "Delete Options",
        value: "Allow",
      },
      {
        name: "Index Order",
        value: "Allow",
      },
      {
        name: "Show Order",
        value: "Allow",
      },
      {
        name: "Edit Order",
        value: "Allow",
      },
      {
        name: "Index Pages",
        value: "Allow",
      },
      {
        name: "Create Pages",
        value: "Allow",
      },
      {
        name: "Edit Pages",
        value: "Allow",
      },
      {
        name: "Delete Pages",
        value: "Allow",
      },
      {
        name: "Index Products",
        value: "Allow",
      },
      {
        name: "Create Products",
        value: "Allow",
      },
      {
        name: "Edit Products",
        value: "Allow",
      },
      {
        name: "Delete Products",
        value: "Allow",
      },
      {
        name: "Index Report",
        value: "Allow",
      },
      {
        name: "Index Review",
        value: "Allow",
      },
      {
        name: "Edit Review",
        value: "Allow",
      },
      {
        name: "Delete Review",
        value: "Allow",
      },
      {
        name: "Edit Settings",
        value: "Allow",
      },
      {
        name: "Index Slider",
        value: "Allow",
      },
      {
        name: "Create Slider",
        value: "Allow",
      },
      {
        name: "Edit Slider",
        value: "Allow",
      },
      {
        name: "Delete Slider",
        value: "Allow",
      },
      {
        name: "Index Tag",
        value: "Allow",
      },
      {
        name: "Create Tag",
        value: "Allow",
      },
      {
        name: "Edit Tag",
        value: "Allow",
      },
      {
        name: "Delete Tag",
        value: "Allow",
      },
      {
        name: "Index Tax",
        value: "Allow",
      },
      {
        name: "Create Tax",
        value: "Allow",
      },
      {
        name: "Edit Tax",
        value: "Allow",
      },
      {
        name: "Delete Tax",
        value: "Allow",
      },
      {
        name: "Index Transaction",
        value: "Allow",
      },
      {
        name: "Index Translation",
        value: "Allow",
      },
      {
        name: "Edit Translation",
        value: "Allow",
      },
      {
        name: "Index Users",
        value: "Allow",
      },
      {
        name: "Create Users",
        value: "Allow",
      },
      {
        name: "Edit Users",
        value: "Allow",
      },
      {
        name: "Delete Users",
        value: "Allow",
      },
      {
        name: "Index Roles",
        value: "Allow",
      },
      {
        name: "Create Roles",
        value: "Allow",
      },
      {
        name: "Edit Roles",
        value: "Allow",
      },
      {
        name: "Delete Roles",
        value: "Allow",
      },
      {
        name: "Edit Storefront",
        value: "Allow",
      },
    ],
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.Password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: "false",
          message: "already exists",
        });
      }
      const token = jwt.sign(
        {
          data: newUser._id,
        },
        "secret",
        {}
      );
      newUser.token = token;
      newUser.Password = hash;

      // console.log("1");
      // console.log(newUser);
      newUser
        .save()
        .then(async (user) => {
          console.log(user);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};

exports.resetPassword = async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Something went wrong" });
    }
    const token = buffer.toString("hex");

    let user;
    try {
      user = await User.findOne({ Email: req.body.Email });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Something went wrong" });
    }

    if (!user) {
      return res.status(422).json({
        status: false,
        message: "User doesn't exists with this email",
      });
    }

    user.resetToken = token;
    user.expireToken = Date.now() + 900000;
    // transporter = mailCreateTransport(Mail);
    const newURL = `http://localhost:5000/reset/${token}`;
    const Mail = await getKeysFromSettings("Mail");
    transporter = mailCreateTransport(Mail);
    console.log(transporter);
    user
      .save()
      .then(async (result) => {
        let info;
        try {
          info = await transporter.sendMail({
            from: `${Mail.MailFromName} <${Mail.MailFromAddress}> `, // sender address
            // from: `${Mail.MailFromName} <noreply@lokostop.in> `, // sender address
            to: user.Email, // list of receivers
            subject: "Password Reset", // Subject line
            text: "You requested for password reset", // plain text body
            html: `<div><p>You requested for password reset</p><h5>Click on this <a href="${newURL}">LINK</a> to reset password </h5></div>`, // html body
          });
        } catch (err) {
          return console.log(err);
        }
        res.json({ message: "Check your email" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          status: false,
          message: "Something went wrong",
        });
      });
  });
};

exports.newPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired" });
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              success: "false",
              message: "already exists",
            });
          }
          user.Password = hash;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user
            .save()
            .then((savedUser) => {
              res
                .status(200)
                .json({
                  status: true,
                  message: "Password updated sucessfully",
                });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                status: false,
                message: "Something went wrong",
              });
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    });
};
