const Category = require("../models/categoryModel");
const Media = require("../models/mediaModel");

exports.addRootCategory = async (req, res) => {
  const { name } = req.body.data;

  if (!name) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundRootCategory;
  try {
    foundRootCategory = await Category.findOne({
      name: name,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundRootCategory) {
    return res.status(422).json({
      success: false,
      message: "This root category already exists",
    });
  }

  let logo;
  if (req.body.logoId) {
    try {
      logo = await Media.findById(req.body.logoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!logo) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Media not found!",
  //   });
  // }

  let banner;
  if (req.body.bannerId) {
    try {
      banner = await Media.findById(req.body.bannerId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!banner) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Media not found!",
  //   });
  // }

  let lastCategory = [];
  try {
    lastCategory = await Category.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
  }

  console.log(lastCategory);

  const newId = lastCategory[0] ? lastCategory[0].ID + 1 : 1;

  const url = name.toLowerCase().split("& ").join("").split(" ").join("-");
  const category = new Category({
    ...req.body.data,
    ID: newId || 1,
    categoryType: "Root",
    url,
    childrenCategory: [],
    logo,
    banner,
  });

  let addedCategory;
  try {
    addedCategory = await category.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: addedCategory,
  });
};

exports.addSubCategory = async (req, res) => {
  const { name } = req.body.data;
  const { parentId } = req.body;

  if (!name || !parentId) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  const url = name.toLowerCase().split("& ").join("").split(" ").join("-");

  let foundParentCategory;
  try {
    foundParentCategory = await Category.findById(parentId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (!foundParentCategory) {
    return res.status(404).json({
      success: false,
      message: "Parent category doesn't exists",
    });
  }

  let foundSubCategory;
  try {
    foundSubCategory = await Category.findOne({
      name: name,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundSubCategory) {
    return res.status(422).json({
      success: false,
      message: "This category already exists",
    });
  }

  let logo;
  if (req.body.logoId) {
    try {
      logo = await Media.findById(req.body.logoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!logo) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Media not found!",
  //   });
  // }

  let banner;
  if (req.body.bannerId) {
    try {
      banner = await Media.findById(req.body.bannerId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  // if (!banner) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Media not found!",
  //   });
  // }

  let lastCategory = [];
  try {
    lastCategory = await Category.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  console.log(lastCategory);

  const newId = lastCategory[0] ? lastCategory[0].ID + 1 : 1;

  const subcategory = new Category({
    ...req.body.data,
    ID: newId || 1,
    parentCategory: foundParentCategory,
    url,
    childrenCategory: [],
    categoryType: "SubCategory",
    logo,
    banner,
  });

  let savedSubCategory;
  try {
    savedSubCategory = await subcategory.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let updatedParentCategory;
  try {
    updatedParentCategory = await Category.findByIdAndUpdate(
      parentId,
      { $push: { childrenCategory: savedSubCategory } },
      { new: true }
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    data: savedSubCategory,
  });
};

exports.getRootCategories = (req, res) => {
  Category.find({ categoryType: "Root" })
    .populate({ path: "logo" })
    .populate({ path: "banner" })
    .then((rootCategories) => {
      res.status(200).json({
        success: true,
        data: rootCategories,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getCategoryById = (req, res) => {
  Category.findById(req.params.id)
    .populate("parentCategory")
    .populate({ path: "logo" })
    .populate({ path: "banner" })
    .then((tag) => {
      return res.status(200).json({
        success: true,
        data: tag,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.editCategory = async (req, res) => {
  let foundRootCategory;
  try {
    foundRootCategory = await Category.findOne({
      name: req.body.data.name,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundRootCategory && foundRootCategory._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This category already exists",
    });
  }
  let logo;
  if (req.body.bannerId) {
    try {
      logo = await Media.findById(req.body.logoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }
  // if (!logo) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Media not found!",
  //   });
  // }

  let banner;
  if (req.body.bannerId) {
    try {
      banner = await Media.findById(req.body.bannerId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }
  // if (!banner) {
  //   return res.status(422).json({
  //     success: false,
  //     message: "Media not found!",
  //   });
  // }
  let updatedCategory;

  try {
    updatedCategory = await Category.findByIdAndUpdate(
      req.body._id,
      {
        ...req.body.data,
        logo: logo,
        banner: banner,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 4",
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedCategory,
  });
};

exports.deleteCategory = async (req, res) => {
  const id = req.body.id;
  console.log(id);

  let foundParentCategory;
  try {
    foundParentCategory = await Category.findById(id);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 1",
    });
  }

  let data;
  try {
    data = await Category.deleteMany({
      _id: { $in: foundParentCategory.childrenCategory },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong 2",
    });
  }

  console.log(data);

  Category.findByIdAndDelete(id)
    .then((d) => {
      return res.status(200).json({
        success: true,
        data2: d,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 3",
      });
    });
};

exports.changeOrder = async (req, res) => {
  const { newIndex, oldIndex, parentCategoryId, id } = req.body;

  // FINDING THE CATEGORY TO BE CHANGED
  let foundCategory;
  try {
    foundCategory = await Category.findById(id);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (!foundCategory) {
    return res.status(422).json({
      success: false,
      message: "menu item not found",
    });
  }

  // FINDING THE NEW PARENT CATEGORY
  let foundParentCategoryNew;
  try {
    foundParentCategoryNew = await Category.findById(parentCategoryId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  // FINDING THE PREVIOUS PARENT CATEGORY
  let foundParentCategoryOld;
  try {
    foundParentCategoryOld = await Category.findById(
      foundCategory.parentCategory
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (
    parentCategoryId &&
    foundCategory.parentCategory &&
    foundCategory.parentCategory == parentCategoryId
  ) {
    // CHANGING POSITION IN SAME ARRAY

    // IF PARENT CATEGORIES NOT FOUND
    if (!foundParentCategoryNew) {
      return res.status(422).json({
        success: false,
        message: "New Parent category not found",
      });
    }

    if (!foundParentCategoryOld) {
      return res.status(422).json({
        success: false,
        message: "New Parent category not found",
      });
    }

    // REMOVING FROM OLD POSITION
    foundParentCategoryOld.childrenCategory =
      foundParentCategoryOld.childrenCategory.filter((m, i) => i != oldIndex);

    // ADDING TO NEW POSITION
    foundParentCategoryOld.childrenCategory.splice(newIndex, 0, foundCategory);

    let updatedParentCategory;
    try {
      updatedParentCategory = await foundParentCategoryOld.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
    res
      .status(200)
      .json({ status: true, parentCategory: updatedParentCategory });
  } else if (parentCategoryId && foundCategory.parentCategory) {
    // CHANGING POSITION IN TWO ARRAYS

    // IF PARENT CATEGORIES NOT FOUND
    if (!foundParentCategoryNew) {
      return res.status(422).json({
        success: false,
        message: "New Parent category not found",
      });
    }

    if (!foundParentCategoryOld) {
      return res.status(422).json({
        success: false,
        message: "New Parent category not found",
      });
    }

    // ADDING TO NEW PARENT
    foundParentCategoryNew.childrenCategory.splice(newIndex, 0, foundCategory);

    foundParentCategoryOld.childrenCategory =
      foundParentCategoryOld.childrenCategory.filter(
        (item, i) => i != oldIndex
      );

    // DELETING FROM OLD PARENT
    foundCategory.parentCategory = foundParentCategoryNew;

    let updatedCategory, updatedCategoryNew, updatedCategoryPrev;
    try {
      updatedCategory = await foundCategory.save();
      updatedCategoryNew = await foundParentCategoryNew.save();
      updatedCategoryPrev = await foundParentCategoryOld.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      updatedCategory,
      updatedCategoryNew,
      updatedCategoryPrev,
    });
  } else if (!parentCategoryId && foundCategory.parentCategory) {
    // IF OLD PARENT NOT FOUND
    if (!foundParentCategoryOld) {
      return res.status(422).json({
        success: false,
        message: "New Parent category not found",
      });
    }

    foundParentCategoryOld.childrenCategory =
      foundParentCategoryOld.childrenCategory.filter((m, i) => i != oldIndex);
    foundCategory.parentCategory = null;
    foundCategory.categoryType = "Root";

    let updatedCategory, updatedCategoryPrev;
    try {
      updatedCategory = await foundCategory.save();
      updatedCategoryPrev = await foundParentCategoryOld.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      updatedCategory,
      updatedCategoryPrev,
    });
  } else if (parentCategoryId && !foundCategory.parentCategory) {
    // IF NEW PARENT NOT FOUND
    if (!foundParentCategoryNew) {
      return res.status(422).json({
        success: false,
        message: "New Parent category not found",
      });
    }
    console.log(foundParentCategoryNew);
    foundParentCategoryNew.childrenCategory.splice(newIndex, 0, foundCategory);

    foundCategory.parentCategory = foundParentCategoryNew;
    foundCategory.MENUTYPE = "SubCategory";

    let updatedCategory, updatedParentCategoryNew;
    try {
      updatedCategory = await foundCategory.save();
      updatedParentCategoryNew = await foundParentCategoryNew.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      updatedCategory,
      updatedParentCategoryNew,
    });
  }
};
