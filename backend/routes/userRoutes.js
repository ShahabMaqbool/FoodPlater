const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

const {requireSuperAdmin}=require("../middleware/roleMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword,
    getSecurity,
    loginActivity,
    toggleTwoFactor,
    getAllUsers,
    updateUserRole
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

router.get(
    "/",
    verifyToken,
    requireSuperAdmin,
    getAllUsers
)

router.put(
    "/:id/role",
    verifyToken,
    requireSuperAdmin,
    updateUserRole
);


module.exports = router;