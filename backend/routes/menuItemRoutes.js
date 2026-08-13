
const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
  menuItems,
  menuItemById,
  addMenuItem,
  editMenuItem,
  removeMenuItem,
  menuItemStats
} = require("../controllers/menuItemController");

const router = express.Router();


// GET ALL MENU ITEMS
router.get("/", verifyToken, requireAdmin, menuItems);


// GET MENU ITEM STATS
router.get("/stats", verifyToken, requireAdmin, menuItemStats);


// GET SINGLE MENU ITEM
router.get("/:id", verifyToken, requireAdmin, menuItemById);


// CREATE MENU ITEM
router.post("/", verifyToken, requireAdmin, addMenuItem);


// UPDATE MENU ITEM
router.put("/:id", verifyToken, requireAdmin, editMenuItem);


// DELETE MENU ITEM
router.delete("/:id", verifyToken, requireAdmin, removeMenuItem);


module.exports = router;