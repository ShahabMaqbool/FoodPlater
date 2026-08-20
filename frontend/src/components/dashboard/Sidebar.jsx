import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../styles/Sidebar.css";

import DashboardIcon from "./icons/DashboardIcon";
import OrdersIcon from "./icons/OrdersIcon";
import MenuItemsIcon from "./icons/MenuItemsIcon";
import CategoriesIcon from "./icons/CategoriesIcon";
import CustomersIcon from "./icons/CustomersIcon";
import ProfileIcon from "./icons/ProfileIcon";
import MoreSquareIcon from "./icons/MoreSquareIcon";
import UsersIcon from "./icons/UsersIcon";

function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    // Dropdown state for 3 dots menu
    const [showDropdown, setShowDropdown] = useState(false);

    // Get user Role form Local Storage (e.g., "admin", "super_admin", "data_entry", "staff")
    const userRole = localStorage.getItem("role");

    // Check user role data entry or limited staff
    const isDataEntry = userRole === "data_entry" || userRole === "staff";

    // Logout Function
    const handleLogout = () => {
        localStorage.clear(); // Clear all user tokens and roles
        navigate("/"); // Redirect to login page
    };

    return (
        <aside className="sidebar">


            {/* Logo */}
            <div className="sidebar-logo">
                FoodPlater
            </div>


            {/* Navigation */}
            <nav className="sidebar-nav">


                {/* Dashboard Only for superAdmin */}
                {!isDataEntry && (
                    <Link
                        to="/dashboard"
                        className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""
                            }`}
                    >
                        <DashboardIcon />

                        <span>Dashboard</span>
                    </Link>
                )}


                {/* Orders only visible to super admin */}
                {!isDataEntry && (
                    <Link
                        to="/orders"
                        className={`sidebar-item ${location.pathname === "/orders" ? "active" : ""
                            }`}
                    >
                        <OrdersIcon />

                        <span>Orders</span>
                    </Link>
                )}


                {/* Menu Items */}
                <Link
                    to="/menu-items"
                    className={`sidebar-item ${location.pathname === "/menu-items" ? "active" : ""
                        }`}
                >
                    <MenuItemsIcon />

                    <span>Menu Items</span>
                </Link>


                {/* Categories */}
                <Link
                    to="/categories"
                    className={`sidebar-item ${location.pathname === "/categories" ? "active" : ""
                        }`}
                >
                    <CategoriesIcon />

                    <span>Categories</span>
                </Link>


                {/* Customers only visible to super Admin */}
                {!isDataEntry && (
                    <Link
                        to="/customers"
                        className={`sidebar-item ${location.pathname === "/customers" ? "active" : ""
                            }`}
                    >
                        <CustomersIcon />

                        <span>Customers</span>
                    </Link>

                )}


                {/* Profile */}
                <Link
                    to="/profile"
                    className={`sidebar-item ${location.pathname === "/profile" ? "active" : ""
                        }`}
                >
                    <ProfileIcon />

                    <span>Profile</span>
                </Link>


                {/* User Management Only for Super Admin Role */}
                {!isDataEntry && (

                    <Link
                        to="/users"
                        className={`sidebar-item ${location.pathname === "/users" ? "active" : ""
                            }`}
                    >

                        <UsersIcon />
                        <span>Users Management</span>
                    </Link>

                )}


            </nav>


            {/* Bottom Admin Profile */}
            <div className="sidebar-profile" style={{ position: "relative" }}>


                <img
                    src="/admin-avatar.jpg"
                    alt="Admin"
                    className="admin-avatar"
                />


                <span className="admin-name">
                    Admin
                </span>


                <button 
                    className="profile-more" 
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    <MoreSquareIcon />
                </button>


                {/* Logout Popup Menu */}
                {showDropdown && (
                    <div style={{
                        position: "absolute",
                        bottom: "50px",
                        right: "10px",
                        backgroundColor: "#fff",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                        borderRadius: "6px",
                        overflow: "hidden",
                        zIndex: 100,
                        width: "120px"
                    }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: "100%",
                                padding: "10px",
                                textAlign: "left",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#dc3545",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                            Logout
                        </button>
                    </div>
                )}


            </div>


        </aside>
    );
}

export default Sidebar;