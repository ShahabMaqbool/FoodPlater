
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require("../models/orderModel");


// =========================================
// GET ALL ORDERS
// =========================================

const orders = async (req, res) => {

    try {

        const data = await getAllOrders();

        res.json({
            message: "Orders fetched successfully",
            orders: data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch orders"
        });

    }
};


// =========================================
// GET SINGLE ORDER
// =========================================

const orderById = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await getOrderById(id);

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order fetched successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch order"
        });

    }
};


// =========================================
// CREATE ORDER
// =========================================

const addOrder = async (req, res) => {

    try {

        const {
            customer_id,
            status,
            items,
            amount
        } = req.body;


        if (!customer_id || !status || !items || amount === undefined) {

            return res.status(400).json({
                message: "customer_id, status, items and amount are required"
            });

        }


        const order = await createOrder(
            customer_id,
            status,
            items,
            amount
        );


        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create order"
        });

    }
};


// =========================================
// UPDATE ORDER
// =========================================

const editOrder = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            status,
            items,
            amount
        } = req.body;


        if (!status || !items || amount === undefined) {

            return res.status(400).json({
                message: "status, items and amount are required"
            });

        }


        const order = await updateOrder(
            id,
            status,
            items,
            amount
        );


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        res.json({
            message: "Order updated successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update order"
        });

    }
};


// =========================================
// DELETE ORDER
// =========================================

const removeOrder = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await deleteOrder(id);


        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        res.json({
            message: "Order deleted successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete order"
        });

    }
};


module.exports = {
    orders,
    orderById,
    addOrder,
    editOrder,
    removeOrder
};