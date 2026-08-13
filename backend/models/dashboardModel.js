
const pool = require("../config/db");

const getDashboardStats = async () => {

    const customersResult = await pool.query(
        "SELECT COUNT(*) FROM customers"
    );

    const totalOrdersResult = await pool.query(
        "SELECT COUNT(*) FROM orders"
    );

    const pendingOrdersResult = await pool.query(
        "SELECT COUNT(*) FROM orders WHERE status = 'pending'"
    );

    const completedOrdersResult = await pool.query(
        "SELECT COUNT(*) FROM orders WHERE status = 'completed'"
    );

    const newOrdersResult = await pool.query(
        "SELECT COUNT(*) FROM orders WHERE status = 'new'"
    );

    return {
        customers: Number(customersResult.rows[0].count),

        totalOrders: Number(
            totalOrdersResult.rows[0].count
        ),

        pendingOrders: Number(
            pendingOrdersResult.rows[0].count
        ),

        completedOrders: Number(
            completedOrdersResult.rows[0].count
        ),

        newOrders: Number(
            newOrdersResult.rows[0].count
        )
    };
};

module.exports = {
    getDashboardStats
};