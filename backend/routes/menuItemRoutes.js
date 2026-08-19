const express = require("express");
const multer = require("multer");

const verifyToken = require("../middleware/authMiddleware");
const { requireSuperAdmin, requireStafforAdmin } = require("../middleware/roleMiddleware");

const {
    menuItems,
    menuItemById,
    addMenuItem,
    editMenuItem,
    removeMenuItem,
    menuItemStats
} = require("../controllers/menuItemController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage: storage });


// GET ALL MENU ITEMS
router.get("/", verifyToken, menuItems);


// GET MENU ITEM STATS
router.get("/stats", verifyToken, menuItemStats);


// GET SINGLE MENU ITEM
router.get("/:id", verifyToken, menuItemById);


// CREATE MENU ITEM (With image upload middleware)
router.post("/", verifyToken, requireStafforAdmin, upload.single("image"), addMenuItem);


// UPDATE MENU ITEM (Added upload.single("image"))
router.put("/:id", verifyToken, requireStafforAdmin, upload.single("image"), editMenuItem);


// DELETE MENU ITEM
router.delete("/:id", verifyToken, requireSuperAdmin, removeMenuItem);


module.exports = router;