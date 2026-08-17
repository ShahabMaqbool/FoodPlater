const pool = require("../config/db");

// CREATE CUSTOMER
const createCustomer = async (name, email, phone) => {
    const result = await pool.query(
        `INSERT INTO customers
        (name, email, phone)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [name, email, phone]
    );

    return result.rows[0];
};


// GET ALL CUSTOMERS
const getAllCustomers = async () => {
    const result = await pool.query(
        `SELECT
            c.id,
            c.name,
            c.email,
            c.created_at,
            c.phone,
            COUNT(o.id)::INTEGER AS orders
         FROM customers c
         LEFT JOIN orders o
            ON o.customer_id = c.id
         GROUP BY
            c.id,
            c.name,
            c.email,
            c.created_at,
            c.phone
         ORDER BY c.id DESC`
    );

    return result.rows;
};


// GET CUSTOMER BY ID
const getCustomerById = async (id) => {
    const result = await pool.query(
        `SELECT
            c.id,
            c.name,
            c.email,
            c.created_at,
            c.phone,
            COUNT(o.id)::INTEGER AS orders
         FROM customers c
         LEFT JOIN orders o
            ON o.customer_id = c.id
         WHERE c.id = $1
         GROUP BY
            c.id,
            c.name,
            c.email,
            c.created_at,
            c.phone`,
        [id]
    );

    return result.rows[0];
};


// UPDATE CUSTOMER
const updateCustomer = async (id, name, email, phone) => {
    const result = await pool.query(
        `UPDATE customers
         SET name = $1,
             email = $2,
             phone = $3
         WHERE id = $4
         RETURNING *`,
        [name, email, phone, id]
    );

    return result.rows[0];
};


// DELETE CUSTOMER
const deleteCustomer = async (id) => {
    const result = await pool.query(
        `DELETE FROM customers
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};


// GET CUSTOMER STATS
const getCustomerStats = async () => {
    const result = await pool.query(
        `SELECT
            (SELECT COUNT(*)
             FROM orders
             WHERE LOWER(status) = 'pending')::INTEGER
             AS pending_orders,

            (SELECT COUNT(*)
             FROM orders
             WHERE LOWER(status) = 'completed')::INTEGER
             AS completed_orders,

            (SELECT COUNT(*)
             FROM customers)::INTEGER
             AS total_customers,

            (SELECT COUNT(DISTINCT customer_id)
             FROM orders
             WHERE customer_id IS NOT NULL)::INTEGER
             AS active_customers`
    );

    return result.rows[0];
};


module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerStats
};