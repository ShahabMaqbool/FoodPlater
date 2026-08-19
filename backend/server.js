require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuItemRoutes=require("./routes/menuItemRoutes");
const categoryRoutes=require("./routes/categoryRoutes");
const customerRoutes=require("./routes/customerRoutes")


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Plater Backend API Running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/menu-items",menuItemRoutes);

app.use("/api/categories",categoryRoutes);


app.use("/api/customers", customerRoutes);

app.use("/uploads", express.static("uploads"));




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

