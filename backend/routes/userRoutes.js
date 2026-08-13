const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
    getProfile
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/profile",
    verifyToken,
    requireAdmin,
    getProfile
);

module.exports = router;