const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerStats
} = require("../models/customerModel");


// CREATE CUSTOMER
const addCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const customer = await createCustomer(
            name,
            email,
            phone
        );

        res.status(201).json({
            message: "Customer created successfully",
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create customer"
        });
    }
};


// GET ALL CUSTOMERS
const customers = async (req, res) => {
    try {
        const customerList = await getAllCustomers();

        res.status(200).json({
            customers: customerList
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customers"
        });
    }
};


// GET CUSTOMER BY ID
const customerById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await getCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer"
        });
    }
};


// UPDATE CUSTOMER
const editCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            phone
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const customer = await updateCustomer(
            id,
            name,
            email,
            phone
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer updated successfully",
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update customer"
        });
    }
};


// DELETE CUSTOMER
const removeCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await deleteCustomer(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully",
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete customer"
        });
    }
};

// GET CUSTOMER STATS
const customerStats = async (req, res) => {
    try {
        const stats = await getCustomerStats();

        res.status(200).json({
            stats
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer stats"
        });
    }
};


module.exports = {
    addCustomer,
    customers,
    customerById,
    editCustomer,
    removeCustomer,
    customerStats

};