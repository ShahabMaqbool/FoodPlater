const {
    findUserById,
    updateUserProfile,
    changeUserPassword,
    getSecurityInfo,
    getLoginActivity,
    updateTwoFactor
} = require("../models/userModel");


// GET PROFILE
const getProfile = async (req, res) => {

    try {

        const user = await findUserById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch profile"
        });

    }

};


// UPDATE PROFILE
const updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            name,
            email,
            phone,
            location
        } = req.body;

        if (!name || !email) {

            return res.status(400).json({
                message: "Name and email are required"
            });

        }

        const updatedUser = await updateUserProfile(
            userId,
            name,
            email,
            phone,
            location
        );

        if (!updatedUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(409).json({
                message: "Email already exists"
            });

        }

        res.status(500).json({
            message: "Failed to update profile"
        });

    }

};


// CHANGE PASSWORD
const changePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "Current Password and New Password are required"
            });

        }

        if (newPassword.length < 6) {

            return res.status(400).json({
                message: "New Password must be at least 6 characters"
            });

        }

        const result = await changeUserPassword(
            userId,
            currentPassword,
            newPassword
        );

        if (!result.success) {

            return res.status(400).json({
                message: result.message
            });

        }

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to change password"
        });

    }

};


// GET SECURITY INFORMATION
const getSecurity = async (req, res) => {

    try {

        const userId = req.user.id;

        const security = await getSecurityInfo(userId);

        if (!security) {

            return res.status(404).json({
                message: "Security information not found"
            });

        }

        res.status(200).json({
            security
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch security information"
        });

    }

};


// GET LOGIN ACTIVITY
const loginActivity = async (req, res) => {

    try {

        const userId = req.user.id;

        const activities = await getLoginActivity(userId);

        res.status(200).json({
            activities
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch login activity"
        });

    }

};


// UPDATE TWO FACTOR
const toggleTwoFactor = async (req, res) => {

    try {

        const userId = req.user.id;

        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {

            return res.status(400).json({
                message: "Enabled must be true or false"
            });

        }

        const result = await updateTwoFactor(
            userId,
            enabled
        );

        res.status(200).json({
            message: enabled
                ? "Two-Factor Authentication enabled"
                : "Two-Factor Authentication disabled",

            two_factor_enabled: result.two_factor_enabled
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update Two-Factor Authentication"
        });

    }

};


module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getSecurity,
    loginActivity,
    toggleTwoFactor
};