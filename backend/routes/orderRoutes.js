const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const { requireSuperAdmin } = require("../middleware/roleMiddleware");

const {
    orders,
    orderById,
    addOrder,
    editOrder,
    removeOrder
} = require("../controllers/orderController");

const router = express.Router();


router.get(
    "/",
    verifyToken,
    orders
);


// Get single order
router.get(
    "/:id",
    verifyToken,
    orderById
);


// Create new order
router.post(
    "/",
    verifyToken,
    addOrder
);


// Update order
router.put(
    "/:id",
    verifyToken,
    editOrder
);


router.delete(
    "/:id",
    verifyToken,
    requireSuperAdmin,
    removeOrder
);


module.exports = router;