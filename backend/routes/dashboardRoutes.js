
const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
    dashboardStats
} = require("../controllers/dashboardController");

const router = express.Router();

router.get(
    "/stats",
    verifyToken,
    requireAdmin,
    dashboardStats
);

module.exports = router;