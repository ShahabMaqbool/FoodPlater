
const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
    orders,
    orderById,
    addOrder,
    editOrder,
    removeOrder
} = require("../controllers/orderController");

const router = express.Router();


// Get all orders
router.get(
    "/",
    verifyToken,
    requireAdmin,
    orders
);


// Get single order
router.get(
    "/:id",
    verifyToken,
    requireAdmin,
    orderById
);


// Create new order
router.post(
    "/",
    verifyToken,
    requireAdmin,
    addOrder
);


// Update order
router.put(
    "/:id",
    verifyToken,
    requireAdmin,
    editOrder
);


// Delete order
router.delete(
    "/:id",
    verifyToken,
    requireAdmin,
    removeOrder
);


module.exports = router;