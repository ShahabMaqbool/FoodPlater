
const pool = require("../config/db");
const bcrypt = require("bcrypt");


// ===============================
// FIND USER BY EMAIL
// ===============================

const findUserByEmail = async (email) => {

    const result = await pool.query(
        `SELECT *
         FROM users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};


// ===============================
// FIND USER BY ID
// ===============================

const findUserById = async (id) => {

    const result = await pool.query(
        `SELECT
            id,
            name,
            email,
            role,
            phone,
            location,
            created_at
         FROM users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};



// CREATE USER


const createUser = async (
    name,
    email,
    password,
    role,
    phone,
    location
) => {

    const result = await pool.query(
        `INSERT INTO users
        (name, email, password, role, phone, location)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            name,
            email,
            role,
            phone,
            location`,
        [
            name,
            email,
            password,
            role || 'data_entry', 
            phone || null,
            location || null
        ]
    );

    return result.rows[0];
};



// UPDATE USER PROFILE


const updateUserProfile = async (
    id,
    name,
    email,
    phone,
    location
) => {

    const result = await pool.query(
        `UPDATE users
         SET
            name = $1,
            email = $2,
            phone = $3,
            location = $4
         WHERE id = $5
         RETURNING
            id,
            name,
            email,
            role,
            phone,
            location,
            created_at`,
        [
            name,
            email,
            phone,
            location,
            id
        ]
    );

    return result.rows[0];
};



// CHANGE USER PASSWORD


const changeUserPassword = async (
    id,
    currentPassword,
    newPassword
) => {

    const result = await pool.query(
        `SELECT password
         FROM users
         WHERE id = $1`,
        [id]
    );

    const user = result.rows[0];

    if (!user) {

        return {
            success: false,
            message: "User not found"
        };

    }


    // Check current password

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) {

        return {
            success: false,
            message: "Current password is incorrect"
        };

    }


    // Hash new password

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );


    // Update password

    await pool.query(
        `UPDATE users
         SET password = $1
         WHERE id = $2`,
        [
            hashedPassword,
            id
        ]
    );


    return {
        success: true
    };
};



// UPDATE LAST LOGIN


const updateLastLogin = async (userId) => {

    const result = await pool.query(
        `UPDATE users
         SET last_login = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING last_login`,
        [userId]
    );

    return result.rows[0];
};



// ADD LOGIN ACTIVITY


const addLoginActivity = async (
    userId,
    ipAddress,
    userAgent
) => {

    const result = await pool.query(
        `INSERT INTO login_activity
        (
            user_id,
            ip_address,
            user_agent
        )
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            userId,
            ipAddress,
            userAgent
        ]
    );

    return result.rows[0];
};



// GET LOGIN ACTIVITY


const getLoginActivity = async (userId) => {

    const result = await pool.query(
        `SELECT
            id,
            login_time,
            ip_address,
            user_agent
         FROM login_activity
         WHERE user_id = $1
         ORDER BY login_time DESC`,
        [userId]
    );

    return result.rows;
};



// GET SECURITY INFORMATION


const getSecurityInfo = async (userId) => {

    const result = await pool.query(
        `SELECT
            id,
            two_factor_enabled,
            last_login
         FROM users
         WHERE id = $1`,
        [userId]
    );

    return result.rows[0];
};



// UPDATE TWO FACTOR


const updateTwoFactor = async (
    userId,
    enabled
) => {

    const result = await pool.query(
        `UPDATE users
         SET two_factor_enabled = $1
         WHERE id = $2
         RETURNING two_factor_enabled`,
        [
            enabled,
            userId
        ]
    );

    return result.rows[0];
};




module.exports = {

    findUserByEmail,

    findUserById,

    createUser,

    updateUserProfile,

    changeUserPassword,

    updateLastLogin,

    addLoginActivity,

    getLoginActivity,

    getSecurityInfo,

    updateTwoFactor

};