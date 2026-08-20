import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {

    const token = localStorage.getItem("token");
    
    // User object ya role ko safely parse/read karein
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = localStorage.getItem("role") || user.role;

    // No login / Unauthorized
    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    // Agar route sirf Super Admin ke liye hai (adminOnly = true)
    // Aur current user "data_entry" ya standard staff hai, toh usay menu-items par redirect kar do
    if (adminOnly && userRole !== "super_admin" && userRole !== "admin") {
        return <Navigate to="/menu-items" replace />;
    }

    return children;
}

export default ProtectedRoute;