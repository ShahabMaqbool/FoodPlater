const pool = require("../config/db");

// CREATE CATEGORY
const createCategory = async (
    category_name,
    description,
    item_count,
    status
) => {

    const result = await pool.query(
        `INSERT INTO categories
        (category_name, description, item_count, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [category_name, description, item_count, status]
    );

    return result.rows[0];
};

// Get all Categories


const getAllCategories = async () => {

    const result = await pool.query(
        `SELECT * FROM categories
         ORDER BY id DESC`
    );

    return result.rows;
};

// get category by id

const getCategoryById=async (id)=>{

    const result=await pool.query(
        `select*from categories
        where id=$1`,
        [id]
    );

    return result.rows[0];

};

// UPDATE CATEGORY
const updateCategory = async (
    id,
    category_name,
    description,
    item_count,
    status
) => {

    const result = await pool.query(
        `UPDATE categories
         SET category_name = $1,
             description = $2,
             item_count = $3,
             status = $4
         WHERE id = $5
         RETURNING *`,
        [
            category_name,
            description,
            item_count,
            status,
            id
        ]
    );

    return result.rows[0];
};

const deleteCategory=async (id)=>{

    const result=await pool.query(
        `delete from categories
        where id=$1
        Returning*`,
        [id]
    
    );

    return result.rows[0];
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

};