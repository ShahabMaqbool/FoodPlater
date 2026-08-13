
const pool = require("../config/db");

// Get all orders
const getAllOrders = async () => {
    const result = await pool.query(`
        SELECT
            o.id,
            c.name AS customer,
            c.phone,
            o.items,
            o.amount,
            o.status,
            o.created_at
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.id
        ORDER BY o.id DESC
    `);

    return result.rows;
};


// Get single order by ID
const getOrderById = async (id) => {
    const result = await pool.query(`
        SELECT
            o.id,
            c.name AS customer,
            c.phone,
            o.items,
            o.amount,
            o.status,
            o.created_at
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.id
        WHERE o.id = $1
    `, [id]);

    return result.rows[0];
};


// Create new order
const createOrder = async (
    customer_id,
    status,
    items,
    amount
) => {

    const result = await pool.query(`
        INSERT INTO orders
        (customer_id, status, items, amount)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [
        customer_id,
        status,
        items,
        amount
    ]);

    return result.rows[0];
};


// Update order
const updateOrder = async (
    id,
    status,
    items,
    amount
) => {

    const result = await pool.query(`
        UPDATE orders
        SET
            status = $1,
            items = $2,
            amount = $3
        WHERE id = $4
        RETURNING *
    `, [
        status,
        items,
        amount,
        id
    ]);

    return result.rows[0];
};


// Delete order
const deleteOrder = async (id) => {

    const result = await pool.query(`
        DELETE FROM orders
        WHERE id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};