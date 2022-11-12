const User = require("../models/userModel");
const Role = require("../models/roleModel");

const result = async (id, permission) => {
  let output = false;
  await User.findById(id)
    .then(async (user) => {
      const perm = user.Permissions.find((element) => {
        if (element.name === permission) return element; //user defined permission in usermodel working mast
      });

      if (perm && perm.value === "Allow") {
        output = true;
      } else {
        console.log(output);
        await user.Roles.forEach(async (element) => {
          // here is the problem await nai chalra
          if (output === true) {
            console.log("here2");
            return;
          }
          await Role.findOne({
            Name: element,
          })
            .then(async (permissions) => {
              const perm = await permissions.Permissions.find((element) => {
                if (element.name === permission) return element;
              });
              console.log(perm);
              if (perm && perm.value === "Allow") {
                console.log("here1");
                output = true;
              }
              console.log(output, "3");
            })
            .catch((err) => console.log(err));
        });
        console.log(output, "2");
      }
    })
    .catch(() => {
      output = false;
    });
  console.log(output, "1");
  return output;
};
const hasPermissions = async (req, res, next) => {
  // console.log(req);
  if (await result(req.user._id, req.body.requiredPermission)) return next();
  else
    return res.status(401).json({
      success: false,
      message: "unauthorised",
    });
};
module.exports = hasPermissions;
