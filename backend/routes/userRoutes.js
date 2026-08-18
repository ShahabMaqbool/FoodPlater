const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword,
    getSecurity,
    loginActivity,
    toggleTwoFactor
} = require("../controllers/userController");

const router = express.Router();


router.get(
    "/profile",
    verifyToken,
    requireAdmin,
    getProfile
);


router.put(
    "/profile",
    verifyToken,
    requireAdmin,
    updateProfile
);

router.put(
    "/change-password",
    verifyToken,
    requireAdmin,
    changePassword
);

// Security information
router.get(
    "/security",
    verifyToken,
    requireAdmin,
    getSecurity
);


// Login activity
router.get(
    "/login-activity",
    verifyToken,
    requireAdmin,
    loginActivity
);


// Two-factor authentication
router.put(
    "/two-factor",
    verifyToken,
    requireAdmin,
    toggleTwoFactor
);




module.exports = router;