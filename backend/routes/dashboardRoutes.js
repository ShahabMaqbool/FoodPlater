const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

const {
    dashboardStats
} = require("../controllers/dashboardController");

const router = express.Router();

router.get(
    "/stats",
    verifyToken,
    dashboardStats
);

module.exports = router;