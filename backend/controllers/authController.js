const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    createUser,
    updateLastLogin,
    addLoginActivity
} = require("../models/userModel");


// ===============================
// REGISTER
// ===============================

const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const existingUser = await findUserByEmail(email);

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await createUser(
            name,
            email,
            hashedPassword,
            "admin"
        );

        res.status(201).json({
            message: "Admin registered successfully",
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ===============================
// LOGIN
// ===============================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user

        const user = await findUserByEmail(email);

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Check password

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Generate JWT

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // ===============================
        // SAVE LAST LOGIN
        // ===============================

        await updateLastLogin(user.id);


        // ===============================
        // SAVE LOGIN ACTIVITY
        // ===============================

        const ipAddress =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
            || req.socket.remoteAddress
            || req.ip;

        const userAgent =
            req.get("user-agent") || "Unknown";


        await addLoginActivity(
            user.id,
            ipAddress,
            userAgent
        );


        // ===============================
        // LOGIN RESPONSE
        // ===============================

        res.json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    register,
    login
};