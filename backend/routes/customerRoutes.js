const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/roleMiddleware");

const {
    addCustomer,
    customers,
    customerById,
    editCustomer,
    removeCustomer,
    customerStats
} = require("../controllers/customerController");

const router = express.Router();


// CREATE CUSTOMER
router.post(
    "/",
    verifyToken,
    requireAdmin,
    addCustomer
);


// GET ALL CUSTOMERS
router.get(
    "/",
    verifyToken,
    requireAdmin,
    customers
);

router.get("/stats", verifyToken, requireAdmin, customerStats);


// GET CUSTOMER BY ID
router.get(
    "/:id",
    verifyToken,
    requireAdmin,
    customerById
);


// UPDATE CUSTOMER
router.put(
    "/:id",
    verifyToken,
    requireAdmin,
    editCustomer
);


// DELETE CUSTOMER
router.delete(
    "/:id",
    verifyToken,
    requireAdmin,
    removeCustomer
);


module.exports = router;