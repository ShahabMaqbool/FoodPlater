const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemStats
} = require("../models/menuItemModel");


// GET ALL MENU ITEMS
const menuItems = async (req, res) => {
  try {
    const data = await getAllMenuItems();

    res.json({
      message: "Menu items fetched successfully",
      menuItems: data
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch menu items"
    });
  }
};


// GET SINGLE MENU ITEM
const menuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await getMenuItemById(id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.json({
      message: "Menu item fetched successfully",
      menuItem: item
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch menu item"
    });
  }
};


// CREATE MENU ITEM (Updated to handle image file via multer)
const addMenuItem = async (req, res) => {
  try {
    const {
      item_name,
      category,
      price,
      status
    } = req.body;

    if (!item_name || !category || price === undefined || !status) {
      return res.status(400).json({
        message: "item_name, category, price and status are required"
      });
    }

    // Get image path if file was uploaded through multer
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await createMenuItem(
      item_name,
      category,
      price,
      status,
      imagePath
    );

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: item
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create menu item"
    });
  }
};


// UPDATE MENU ITEM
const editMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      item_name,
      category,
      price,
      status
    } = req.body;

    if (!item_name || !category || price === undefined || !status) {
      return res.status(400).json({
        message: "item_name, category, price and status are required"
      });
    }

    const existingItem = await getMenuItemById(id);
    if (!existingItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : existingItem.image;

    const item = await updateMenuItem(
      id,
      item_name,
      category,
      price,
      status,
      imagePath
    );

    res.json({
      message: "Menu item updated successfully",
      menuItem: item
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update menu item"
    });
  }
};


// DELETE MENU ITEM
const removeMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await deleteMenuItem(id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.json({
      message: "Menu item deleted successfully",
      menuItem: item
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete menu item"
    });
  }
};


// GET MENU ITEM STATS
const menuItemStats = async (req, res) => {
  try {
    const stats = await getMenuItemStats();

    res.json({
      message: "Menu item stats fetched successfully",
      stats
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch menu item stats"
    });
  }
};


module.exports = {
  menuItems,
  menuItemById,
  addMenuItem,
  editMenuItem,
  removeMenuItem,
  menuItemStats
};