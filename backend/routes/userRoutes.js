const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

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
    getProfile
);


router.put(
    "/profile",
    verifyToken,
    updateProfile
);

router.put(
    "/change-password",
    verifyToken,
    changePassword
);

// Security information
router.get(
    "/security",
    verifyToken,
    getSecurity
);


// Login activity
router.get(
    "/login-activity",
    verifyToken,
    loginActivity
);


// Two-factor authentication
router.put(
    "/two-factor",
    verifyToken,
    toggleTwoFactor
);


module.exports = router;