
const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "super_admin") {
        return res.status(403).json({ 
            message: "Access denied. Only Super Admin can Perform this action" 
        });
    }

    next();
};


const requireStafforAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }


    if (req.user.role === "super_admin" || req.user.role === "data_entry") {
        return next();
    }

    return res.status(403).json({ 
        message: "Access denied." 
    });
};

module.exports = { requireSuperAdmin, requireStafforAdmin };