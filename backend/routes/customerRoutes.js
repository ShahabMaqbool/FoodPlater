const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const {requireSuperAdmin} = require("../middleware/roleMiddleware");

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
    addCustomer
);


// GET ALL CUSTOMERS
router.get(
    "/",
    verifyToken,
    customers
);

router.get("/stats", verifyToken,customerStats);


// GET CUSTOMER BY ID
router.get(
    "/:id",
    verifyToken,
    customerById
);


// UPDATE CUSTOMER
router.put(
    "/:id",
    verifyToken,
    editCustomer
);


// DELETE CUSTOMER
router.delete(
    "/:id",
    verifyToken,
    requireSuperAdmin,
    removeCustomer
);


module.exports = router;