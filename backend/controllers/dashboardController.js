
const {
    getDashboardStats
} = require("../models/dashboardModel");

const dashboardStats = async (req, res) => {

    try {

        const stats = await getDashboardStats();

        res.json({
            message: "Dashboard stats fetched successfully",
            stats
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch dashboard stats"
        });

    }
};

module.exports = {
    dashboardStats
};