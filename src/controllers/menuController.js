const Menu = require("../models/menuModel");
const Media = require("../models/mediaModel");
const MenuItem = require("../models/menuItemModel");
const Category = require("../models/categoryModel");
const Page = require("../models/pageModel");

exports.addMenu = async (req, res) => {
  if (!req.body.data.name) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let foundMenu;
  try {
    foundMenu = await Menu.findOne({ name: req.body.data.name });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 1",
    });
  }

  if (foundMenu) {
    return res.status(422).json({
      success: false,
      message: "This name already exists",
    });
  }

  let lastMenu = [];
  try {
    lastMenu = await Menu.find().sort("-createdAt").limit(1);
  } catch (err) {
    console.log(err);
    // return res.status(422).json({
    //   success: false,
    //   message: "This media doesn't exists",
    // });
  }

  // console.log(lastMenu);

  const newId = lastMenu[0] ? lastMenu[0].ID + 1 : 1;

  const menu = new Menu({
    ...req.body.data,
    ID: newId || 1,
  });

  menu
    .save()
    .then((addMenu) => {
      return res.status(200).json({
        success: true,
        data: addMenu,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    });
};

exports.getMenuById = (req, res) => {
  Menu.findById(req.params.id)
    .populate({ path: "menuItems" })
    .then((menu) => {
      return res.status(200).json({
        success: true,
        data: menu,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.getMenus = (req, res) => {
  let { sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  Menu.find()
    .skip(skipNumber)
    .limit(limitNumber)
    .sort(sortBy)
    .populate({ path: "menuItems" })
    .then((menu) => {
      res.status(200).json({
        success: true,
        data: menu,
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

exports.searchMenus = (req, res) => {
  let { searchWord, sortBy, skipNumber, limitNumber } = req.body;
  sortBy = sortBy ? sortBy : "-createdAt";
  if (searchWord) {
    Menu.find({ name: { $regex: searchWord } })
      .skip(skipNumber)
      .limit(limitNumber)
      .sort(sortBy)
      .populate({ path: "menuItems" })
      .then((menu) => {
        return res.status(200).json({
          success: true,
          data: menu,
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

exports.addMenuItem = async (req, res) => {
  if (!req.body.data.name || !req.body.data.type || !req.body.menuId) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  if (
    (req.body.data.type === "Category" && !req.body.CategoryId) ||
    (req.body.data.type === "Page" && !req.body.PageId) ||
    (req.body.data.type === "URL" && !req.body.data.url)
  ) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let category;
  if (req.body.data.type === "Category") {
    try {
      category = await Category.findById(req.body.CategoryId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!category) {
      return res.status(422).json({
        success: false,
        message: "Category not found!",
      });
    }
  }

  let page;
  if (req.body.data.type === "Page") {
    try {
      page = await Page.findById(req.body.PageId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!page) {
      return res.status(422).json({
        success: false,
        message: "Page not found!",
      });
    }
  }

  let image;
  if (req.body.ImageId) {
    try {
      image = await Media.findById(req.body.ImageId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  console.log(image);

  let parentMenu = null,
    MENUTYPE = "Root";
  if (req.body.parentMenuId) {
    MENUTYPE = "SubMenuItem";
    try {
      parentMenu = await MenuItem.findById(req.body.parentMenuId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong 3",
      });
    }

    if (!parentMenu) {
      return res.status(422).json({
        success: false,
        message: "Menu Item not found!",
      });
    }
  }

  let MENU;

  try {
    MENU = await Menu.findById(req.body.menuId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong 3",
    });
  }

  if (!MENU) {
    return res.status(422).json({
      success: false,
      message: "Menu not found!",
    });
  }

  const menuItem = new MenuItem({
    ...req.body.data,
    category,
    image,
    page,
    menu: MENU,
    parentMenu,
    MENUTYPE,
  });

  let savedMenuItem;
  try {
    savedMenuItem = await menuItem.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  let updatedMenuItem, updatedMenu;

  if (parentMenu) {
    try {
      updatedMenuItem = await MenuItem.findByIdAndUpdate(
        req.body.parentMenuId,
        {
          $push: { childrenMenu: savedMenuItem },
        },
        { new: true }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong 2",
      });
    }
  } else {
    try {
      console.log(req.body.menuId);
      updatedMenu = await Menu.findByIdAndUpdate(
        req.body.menuId,
        {
          $push: { menuItems: savedMenuItem },
        },
        { new: true }
      );
      console.log(updatedMenu);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  return res.status(200).json({
    status: true,
    data: {
      menu: updatedMenu,
      menuItem: savedMenuItem,
      parentMenuItem: updatedMenuItem,
    },
  });
};

exports.getMenuItem = (req, res) => {
  MenuItem.find()
    // .populate({ path: "category", select: "_id name" })
    // .populate({ path: "page", select: "_id name" })
    // .populate({ path: "parentMenu", select: "_id name" })
    .then((menuItem) => {
      return res.status(200).json({
        success: true,
        data: menuItem,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};
exports.getMenuItemById = (req, res) => {
  MenuItem.findById(req.params.id)
    .populate({ path: "category", select: "_id name" })
    .populate({ path: "page", select: "_id name" })
    .populate({ path: "parentMenu", select: "_id name" })
    .then((menuItem) => {
      // console.log();
      return res.status(200).json({
        success: true,
        data: menuItem,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.editMenu = async (req, res) => {
  let foundMenu;
  try {
    foundMenu = await Menu.findOne({ name: req.body.data.name });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (foundMenu && foundMenu._id != req.body._id) {
    return res.status(422).json({
      success: false,
      message: "This name already exists",
    });
  }

  Menu.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
    },
    { new: true }
  )
    .then((updatedMenu) => {
      return res.status(200).json({
        success: true,
        data: updatedMenu,
      });
    })
    .catch((err) => {
      return res.status(422).json({
        success: false,
        message: "This name already exists",
      });
    });
};

exports.editMenuItem = async (req, res) => {
  if (
    (req.body.data.type === "Category" && !req.body.CategoryId) ||
    (req.body.data.type === "Page" && !req.body.PageId) ||
    (req.body.data.type === "URL" && !req.body.data.url)
  ) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }

  let category;
  if (req.body.data.type === "Category") {
    try {
      category = await Category.findById(req.body.CategoryId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!category) {
      return res.status(422).json({
        success: false,
        message: "Category not found!",
      });
    }
  }

  let page;
  if (req.body.data.type === "Page") {
    try {
      page = await Page.findById(req.body.PageId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!page) {
      return res.status(422).json({
        success: false,
        message: "Page not found!",
      });
    }
  }

  let image;
  if (req.body.ImageId) {
    try {
      image = await Media.findById(req.body.ImageId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  }

  MenuItem.findByIdAndUpdate(
    req.body._id,
    {
      ...req.body.data,
      category,
      image,
      page,
    },
    { new: true }
  )
    .then((updatedMenuItem) => {
      return res.status(200).json({
        success: true,
        data: updatedMenuItem,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.changeOrder = async (req, res) => {
  const { newIndex, oldIndex, parentMenuId, id } = req.body;

  let foundMenuItem;
  try {
    foundMenuItem = await MenuItem.findById(id);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (!foundMenuItem) {
    return res.status(422).json({
      success: false,
      message: "menu item not found",
    });
  }

  // let updatedMenuItem = foundMenuItem;

  let ParentMenuItem;
  try {
    ParentMenuItem = await MenuItem.findById(parentMenuId);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  if (
    parentMenuId &&
    foundMenuItem.parentMenu &&
    foundMenuItem.parentMenu == parentMenuId
  ) {
    if (!ParentMenuItem) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    ParentMenuItem.childrenMenu = ParentMenuItem.childrenMenu.filter(
      (m, i) => i != oldIndex
    );
    ParentMenuItem.childrenMenu.splice(newIndex, 0, foundMenuItem);

    try {
      // console.log(ParentMenuItem.childrenMenu[0]);
      // console.log(ParentMenuItem.childrenMenu[1]);
      updatedParentMenuItem = await ParentMenuItem.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
    res.status(200).json({ status: true, parentItem: updatedParentMenuItem });
  } else if (!parentMenuId && !foundMenuItem.parentMenu) {
    console.log(1);
    let foundMenu;
    try {
      foundMenu = await Menu.findById(foundMenuItem.menu);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundMenu) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }
    // console.log(foundMenu.menuItems[0]);

    let updatedMenu;

    foundMenu.menuItems = foundMenu.menuItems.filter((m, i) => i != oldIndex);
    foundMenu.menuItems.splice(newIndex, 0, foundMenuItem);

    try {
      console.log(foundMenu.menuItems[0]._id, 0);
      console.log(foundMenu.menuItems[1], 1);
      updatedMenu = await foundMenu.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    // console.log(updatedMenu);

    res.status(200).json({ status: true, menu: updatedMenu });
  } else if (parentMenuId && foundMenuItem.parentMenu) {
    if (!ParentMenuItem) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    let foundPrevParentMenuItem;
    try {
      foundPrevParentMenuItem = await MenuItem.findById(
        foundMenuItem.parentMenu
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundPrevParentMenuItem) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    ParentMenuItem.childrenMenu.splice(newIndex, 0, foundMenuItem);

    foundPrevParentMenuItem.childrenMenu =
      foundPrevParentMenuItem.childrenMenu.filter((item, i) => i != oldIndex);

    foundMenuItem.parentMenu = ParentMenuItem;

    let updatedMenuItem, updatedParentMenuItem, updatedPrevParentItem;
    try {
      updatedMenuItem = await foundMenu.save();
      updatedParentMenuItem = await ParentMenuItem.save();
      updatedPrevParentItem = await foundPrevParentMenuItem.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      updatedMenuItem,
      updatedParentMenuItem,
      updatedPrevParentItem,
    });
  } else if (parentMenuId && !foundMenuItem.parentMenu) {
    if (!ParentMenuItem) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    ParentMenuItem.childrenMenu.splice(newIndex, 0, foundMenuItem);

    let foundMenu;
    try {
      foundMenu = await Menu.findById(foundMenuItem.menu);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundMenu) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    foundMenu.menuItems = foundMenu.menuItems.filter((m, i) => i != oldIndex);

    foundMenuItem.parentMenu = ParentMenuItem;
    foundMenuItem.MENUTYPE = "SubMenuItem";

    let updatedMenuItem, updatedParentMenuItem, updatedMenu;
    try {
      updatedMenuItem = await foundMenuItem.save();
      updatedParentMenuItem = await ParentMenuItem.save();
      updatedMenu = await foundMenu.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      updatedMenuItem,
      updatedParentMenuItem,
      updatedMenu,
    });
  } else if (!parentMenuId && foundMenuItem.parentMenu) {
    let foundMenu;
    try {
      foundMenu = await Menu.findById(foundMenuItem.menu);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundMenu) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    foundMenu.menuItems.splice(newIndex, 0, foundMenuItem);

    let foundPrevParentMenuItem;
    try {
      foundPrevParentMenuItem = await MenuItem.findById(
        foundMenuItem.parentMenu
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!foundPrevParentMenuItem) {
      return res.status(422).json({
        success: false,
        message: "parent menu item not found",
      });
    }

    foundPrevParentMenuItem.childrenMenu = foundPrevParentMenuItem.childrenMenu.filter(
      (m, i) => i != oldIndex
    );
    foundMenuItem.parentMenu = null;
    foundMenuItem.MENUTYPE = "Root";

    let updatedMenuItem, updatedMenu, updatedPrevParentItem;
    try {
      updatedMenuItem = await foundMenuItem.save();
      updatedMenu = await foundMenu.save();
      updatedPrevParentItem = await foundPrevParentMenuItem.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      updatedMenuItem,
      updatedMenu,
      updatedPrevParentItem,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  const { id } = req.body;
  let foundMenus;
  try {
    foundMenus = await Menu.find({ _id: { $in: id } });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong 1",
    });
  }

  const deletedMenus = foundMenus.map(async (menu) => {
    let deletedMenuItems;
    try {
      deletedMenuItems = await MenuItem.deleteMany({ menu: menu._id });
    } catch (err) {
      return null;
    }

    let deletedMenu;
    try {
      deletedMenu = await Menu.findByIdAndDelete(menu._id);
    } catch (err) {
      return null;
    }

    return { deletedMenuItems, deletedMenu };
  });

  const data = await Promise.all(deletedMenus);

  return res.status(200).json({
    status: true,
    data: data,
  });
};

exports.deleteMenuItem = async (req, res) => {
  let foundMenuItem;
  try {
    foundMenuItem = await MenuItem.findById(req.body._id);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong 1",
    });
  }

  if (!foundMenuItem) {
    return res.status(422).json({
      success: false,
      message: "Menu doesn't exists",
    });
  }

  let deletedChildrenMenuItems;
  try {
    deletedChildrenMenuItems = await MenuItem.deleteMany({
      _id: { $in: foundMenuItem.childrenMenu },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong 2",
    });
  }

  let deletedMenuItem;
  try {
    deletedMenuItem = await MenuItem.findByIdAndDelete(req.body._id);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }

  return res.status(200).json({
    status: true,
    data: {
      deletedMenuItem,
      deletedChildrenMenuItems,
    },
  });
};
