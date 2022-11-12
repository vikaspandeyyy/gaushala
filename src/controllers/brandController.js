const Brand = require("../models/brandModel");
const Media = require("../models/mediaModel");
var mongoose = require("mongoose");
const { copySync } = require("fs-extra");
const { getKeysFromSettings } = require("../middlewares/getSetting");

exports.addBrand = async (req, res) => {
  console.log(req);
  console.log(req.body.requiredPermission);

  const { name } = req.body.data;
  console.log(name);
  // return res.json({body: req.body, file: req.files});

  if (!name) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundBrandByName;
  try {
    foundBrandByName = await Brand.findOne({ name: name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  console.log(foundBrandByName);

  if (foundBrandByName) {
    return res.status(422).json({
      success: false,
      message: "This brand name is already taken",
    });
  }

  const url = name.toLowerCase().split(" ").join("-");
  console.log(url);

  let logo;
  if (req.body.logo) {
    try {
      logo = await Media.findById(req.body.logo);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!logo) {
      return res.status(422).json({
        success: false,
        message: "This media doesn't exists",
      });
    }
  }

  let banner;
  if (req.body.banner) {
    try {
      banner = await Media.findById(req.body.banner);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!banner) {
      return res.status(422).json({
        success: false,
        message: "This media doesn't exists",
      });
    }
  }
  // Brand.createIndex({ _id: 1 }, { unqiue: true });

  let lastBrand = [];
  try {
    lastBrand = await Brand.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  console.log(lastBrand);

  const newId = lastBrand[0] ? lastBrand[0].ID + 1 : 1;

  const brand = new Brand({
    ...req.body.data,
    ID: newId || 1,
    url,
    logo: logo,
    banner: banner,
  });
  brand
    .save()
    .then((addedBrand) => {
      return res.status(200).json({
        success: true,
        data: addedBrand,
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

// const x = async () => {
//   return await getKeysFromSettings("SocialLogins", "Google", "ClientID");
// };

const Setting = require("../models/settingModel");
let m;

exports.getKeysFromSettings = async (type, name, key) => {
  let data;
  try {
    data = await Setting.find({});
  } catch (err) {
    console.log(err);
  }
  console.log(data[0]["SocialLogins"]["Google"]["ClientID"]);
  const x = data[0][type][name][key];
  m = x;

  return x;
};
exports.getBrand = async (req, res) => {
  const x = () => {
    return getKeysFromSettings("SocialLogins", "Google", "ClientID");
    // return m.Promise();
  };
  // console.log(m, "m");
  // const x = await getKeysFromSettings("SocialLogins", "Google", "ClientID");

  // const textPromises = urls.map(url => {
  //   return getKeysFromSettings("SocialLogins", "Google", "ClientID").then(response => response.text());
  // });

  // // log them in order
  // x.reduce((chain, textPromise) => {
  //   return chain.then(() => textPromise)
  //     .then(text => console.log(text));
  // }, Promise.resolve());

  console.log(x, "X");
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Brand.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate({ path: "logo" })
    .populate({ path: "banner" })
    .then((brand) => {
      res.status(200).json({
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
};

exports.getBrandById = (req, res) => {
  Brand.findById(req.params.id)
    .populate({ path: "logo" })
    .populate({ path: "banner" })
    .then((brand) => {
      return res.status(200).json({
        success: true,
        data: brand,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.searchBrands = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Brand.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate({ path: "logo" })
      .populate({ path: "banner" })
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

exports.editBrand = async (req, res) => {
  let foundBrandByName;
  try {
    foundBrandByName = await Brand.findOne({ name: req.body.data.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundBrandByName && foundBrandByName._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This tag name is already taken",
    });
  }

  let foundBrandByUrl;
  try {
    foundBrandByUrl = await Brand.findOne({ url: req.body.url });
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

  let logo;
  if (req.body.logo) {
    try {
      logo = await Media.findById(req.body.logo);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!logo) {
      return res.status(422).json({
        success: false,
        message: "This media doesn't exists",
      });
    }
  }

  let banner;
  if (req.body.banner) {
    try {
      banner = await Media.findById(req.body.banner);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!banner) {
      return res.status(422).json({
        success: false,
        message: "This media doesn't exists",
      });
    }
  }

  Brand.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
      logo: logo,
      banner: banner,
    },
    {
      new: true,
    }
  )
    .then((editedBrand) => {
      return res.status(200).json({
        success: true,
        data: editedBrand,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.deleteBrand = (req, res) => {
  const id = req.body.id;

  Brand.deleteMany({ _id: { $in: id } })
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
