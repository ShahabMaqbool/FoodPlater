import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // No login
    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    // Admin and data entry role
    if (adminOnly && user.role !== "super_admin" && user.role !== "data_entry") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;