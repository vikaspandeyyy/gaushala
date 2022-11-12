const Role = require("../models/roleModel");

exports.addRole = (req, res) => {
  Role.findOne({ Name: req.body.data.Name })
    .then(async (foundRole) => {
      console.log(foundRole);
      if (foundRole) {
        return res.status(422).json({
          success: false,
          message: "Role already exists",
        });
      }

      let lastRole = [];
      try {
        lastRole = await Role.find().sort("-createdAt").limit(1);
      } catch (err) {
        console.log(err);
      }

      console.log(lastRole);

      const newId = lastRole[0] ? lastRole[0].ID + 1 : 1;

      const role = new Role({
        ...req.body.data,
        ID: newId || 1,
      });
      console.log(role);
      role
        .save()
        .then((addedRole) => {
          return res.status(200).json({
            success: true,
            data: addedRole,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "something went wrong",
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getRoleById = (req, res) => {
  Role.findById(req.params.id)
    .then((role) => {
      return res.status(200).json({
        success: true,
        data: role,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getRoles = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Role.find()
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

exports.searchRoles = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Role.find({ Name: { $regex: searchWord } })
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

exports.editRole = (req, res) => {
  Role.findOne({ name: req.body.data.Name })
    .then((foundRole) => {
      if (foundRole && foundRole._id != req.body._id) {
        return res.status(422).json({
          success: false,
          message: "Role aready exists",
        });
      }
      Role.findByIdAndUpdate(
        req.body._id,
        {
          ...req.body.data,
        },
        {
          new: true,
        }
      )
        .then((editedRole) => {
          return res.status(200).json({
            success: true,
            data: editedRole,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "something went wrong",
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteRole = (req, res) => {
  let deleteCount = 0,
    ommittedIds = [];
  req.body.id
    .forEach((element) => {
      User.findByIdAndDelete(element)
        .then(() => {
          deleteCount++;
        })
        .catch(() => {
          {
            ommittedIds.push(element);
          }
        });
    })
    .then(() => {
      return res.status(200).json({
        success: "true",
        data: {
          deleteCount,
          ommittedIds,
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

exports.deleteRoles = (req, res) => {
  const id = req.body.id;

  Role.deleteMany({ _id: { $in: id } })
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

exports.createAdminRole = async () => {
  let lastRole = [];
  try {
    lastRole = await Role.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  console.log(lastRole);

  const newId = lastRole[0] ? lastRole[0].ID + 1 : 1;
  const role = new Role({
    Name: "admin",
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
    ID: newId || 1,
  });

  role
    .save()
    .then((addedRole) => {
      console.log(addedRole);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createCustomerRole = async () => {
  let lastRole = [];
  try {
    lastRole = await Role.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  console.log(lastRole);

  const newId = lastRole[0] ? lastRole[0].ID + 1 : 1;
  const role = new Role({
    Name: "Customer",
    Permissions: [
      {
        name: "Index Attributes",
        value: "Deny",
      },
      {
        name: "Create Attributes",
        value: "Deny",
      },
      {
        name: "Edit Attributes",
        value: "Deny",
      },
      {
        name: "Delete Attributes",
        value: "Deny",
      },
      {
        name: "Index Attribute Set",
        value: "Deny",
      },
      {
        name: "Create Attribute Set",
        value: "Deny",
      },
      {
        name: "Edit Attribute Set",
        value: "Deny",
      },
      {
        name: "Delete Attribute Set",
        value: "Deny",
      },
      {
        name: "Index Brand",
        value: "Deny",
      },
      {
        name: "Create Brand",
        value: "Deny",
      },
      {
        name: "Edit Brand",
        value: "Deny",
      },
      {
        name: "Delete Brand",
        value: "Deny",
      },
      {
        name: "Index Categories",
        value: "Deny",
      },
      {
        name: "Create Categories",
        value: "Deny",
      },
      {
        name: "Edit Categories",
        value: "Deny",
      },
      {
        name: "Delete Categories",
        value: "Deny",
      },
      {
        name: "Index Coupons",
        value: "Deny",
      },
      {
        name: "Create Coupons",
        value: "Deny",
      },
      {
        name: "Edit Coupons",
        value: "Deny",
      },
      {
        name: "Delete Coupons",
        value: "Deny",
      },
      {
        name: "Index Currency Rates",
        value: "Deny",
      },
      {
        name: "Edit Currency Rates",
        value: "Deny",
      },
      {
        name: "Index Flash Sales",
        value: "Deny",
      },
      {
        name: "Create Flash Sales",
        value: "Deny",
      },
      {
        name: "Edit Flash Sales",
        value: "Deny",
      },
      {
        name: "Delete Flash Sales",
        value: "Deny",
      },
      {
        name: "Index Import",
        value: "Deny",
      },
      {
        name: "Create Import",
        value: "Deny",
      },
      {
        name: "Index Media",
        value: "Deny",
      },
      {
        name: "Create Media",
        value: "Deny",
      },
      {
        name: "Delete Media",
        value: "Deny",
      },
      {
        name: "Index Menus",
        value: "Deny",
      },
      {
        name: "Create Menus",
        value: "Deny",
      },
      {
        name: "Edit Menus",
        value: "Deny",
      },
      {
        name: "Delete Menus",
        value: "Deny",
      },
      {
        name: "Index Menu Items",
        value: "Deny",
      },
      {
        name: "Create Menu Items",
        value: "Deny",
      },
      {
        name: "Edit Menu Items",
        value: "Deny",
      },
      {
        name: "Delete Menu Items",
        value: "Deny",
      },
      {
        name: "Index Options",
        value: "Deny",
      },
      {
        name: "Create Options",
        value: "Deny",
      },
      {
        name: "Edit Options",
        value: "Deny",
      },
      {
        name: "Delete Options",
        value: "Deny",
      },
      {
        name: "Index Order",
        value: "Deny",
      },
      {
        name: "Show Order",
        value: "Deny",
      },
      {
        name: "Edit Order",
        value: "Deny",
      },
      {
        name: "Index Pages",
        value: "Deny",
      },
      {
        name: "Create Pages",
        value: "Deny",
      },
      {
        name: "Edit Pages",
        value: "Deny",
      },
      {
        name: "Delete Pages",
        value: "Deny",
      },
      {
        name: "Index Products",
        value: "Deny",
      },
      {
        name: "Create Products",
        value: "Deny",
      },
      {
        name: "Edit Products",
        value: "Deny",
      },
      {
        name: "Delete Products",
        value: "Deny",
      },
      {
        name: "Index Report",
        value: "Deny",
      },
      {
        name: "Index Review",
        value: "Deny",
      },
      {
        name: "Edit Review",
        value: "Deny",
      },
      {
        name: "Delete Review",
        value: "Deny",
      },
      {
        name: "Edit Settings",
        value: "Deny",
      },
      {
        name: "Index Slider",
        value: "Deny",
      },
      {
        name: "Create Slider",
        value: "Deny",
      },
      {
        name: "Edit Slider",
        value: "Deny",
      },
      {
        name: "Delete Slider",
        value: "Deny",
      },
      {
        name: "Index Tag",
        value: "Deny",
      },
      {
        name: "Create Tag",
        value: "Deny",
      },
      {
        name: "Edit Tag",
        value: "Deny",
      },
      {
        name: "Delete Tag",
        value: "Deny",
      },
      {
        name: "Index Tax",
        value: "Deny",
      },
      {
        name: "Create Tax",
        value: "Deny",
      },
      {
        name: "Edit Tax",
        value: "Deny",
      },
      {
        name: "Delete Tax",
        value: "Deny",
      },
      {
        name: "Index Transaction",
        value: "Deny",
      },
      {
        name: "Index Translation",
        value: "Deny",
      },
      {
        name: "Edit Translation",
        value: "Deny",
      },
      {
        name: "Index Users",
        value: "Deny",
      },
      {
        name: "Create Users",
        value: "Deny",
      },
      {
        name: "Edit Users",
        value: "Deny",
      },
      {
        name: "Delete Users",
        value: "Deny",
      },
      {
        name: "Index Roles",
        value: "Deny",
      },
      {
        name: "Create Roles",
        value: "Deny",
      },
      {
        name: "Edit Roles",
        value: "Deny",
      },
      {
        name: "Delete Roles",
        value: "Deny",
      },
      {
        name: "Edit Storefront",
        value: "Deny",
      },
    ],
    ID: newId || 1,
  });

  role
    .save()
    .then((addedRole) => {
      console.log(addedRole);
    })
    .catch((err) => {
      console.log(err);
    });
};
