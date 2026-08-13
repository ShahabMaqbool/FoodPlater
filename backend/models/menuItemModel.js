const pool = require("../config/db");

// GET ALL MENU ITEMS
const getAllMenuItems = async () => {
  const result = await pool.query(`
    SELECT
      id,
      item_name,
      category,
      price,
      status,
      image,
      created_at
    FROM menu_items
    ORDER BY id DESC
  `);

  return result.rows;
};


// GET SINGLE MENU ITEM
const getMenuItemById = async (id) => {
  const result = await pool.query(`
    SELECT
      id,
      item_name,
      category,
      price,
      status,
      image,
      created_at
    FROM menu_items
    WHERE id = $1
  `, [id]);

  return result.rows[0];
};


// CREATE MENU ITEM
const createMenuItem = async (
  item_name,
  category,
  price,
  status,
  image
) => {
  const result = await pool.query(`
    INSERT INTO menu_items
    (item_name, category, price, status, image)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [
    item_name,
    category,
    price,
    status,
    image
  ]);

  return result.rows[0];
};


// UPDATE MENU ITEM
const updateMenuItem = async (
  id,
  item_name,
  category,
  price,
  status,
  image
) => {
  const result = await pool.query(`
    UPDATE menu_items
    SET
      item_name = $1,
      category = $2,
      price = $3,
      status = $4,
      image = $5
    WHERE id = $6
    RETURNING *
  `, [
    item_name,
    category,
    price,
    status,
    image,
    id
  ]);

  return result.rows[0];
};


// DELETE MENU ITEM
const deleteMenuItem = async (id) => {
  const result = await pool.query(`
    DELETE FROM menu_items
    WHERE id = $1
    RETURNING *
  `, [id]);

  return result.rows[0];
};


// STATS
const getMenuItemStats = async () => {
  const totalResult = await pool.query(`
    SELECT COUNT(*) FROM menu_items
  `);

  const inStockResult = await pool.query(`
    SELECT COUNT(*)
    FROM menu_items
    WHERE status = 'in_stock'
  `);

  const outOfStockResult = await pool.query(`
    SELECT COUNT(*)
    FROM menu_items
    WHERE status = 'out_of_stock'
  `);

  return {
    totalItems: Number(totalResult.rows[0].count),
    inStockItems: Number(inStockResult.rows[0].count),
    outOfStockItems: Number(outOfStockResult.rows[0].count)
  };
};


module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemStats
};