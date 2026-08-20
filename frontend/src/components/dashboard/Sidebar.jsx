import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../styles/Sidebar.css";

import DashboardIcon from "./icons/DashboardIcon";
import OrdersIcon from "./icons/OrdersIcon";
import MenuItemsIcon from "./icons/MenuItemsIcon";
import CategoriesIcon from "./icons/CategoriesIcon";
import CustomersIcon from "./icons/CustomersIcon";
import ProfileIcon from "./icons/ProfileIcon";
import MoreSquareIcon from "./icons/MoreSquareIcon";

function Sidebar() {

    const location = useLocation();

    // Get user Role form Local Storage (e.g., "admin", "super_admin", "data_entry", "staff")
    const userRole = localStorage.getItem("role");

    // Check user role data entry or limited staff
    const isDataEntry = userRole === "data_entry" || userRole === "staff";

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

                        {/*Icon Here attch it */}
                        <span>Users Management</span>
                    </Link>

                )}


            </nav>


            {/* Bottom Admin Profile */}
            <div className="sidebar-profile">


                <img
                    src="/admin-avatar.jpg"
                    alt="Admin"
                    className="admin-avatar"
                />


                <span className="admin-name">
                    Admin
                </span>


                <button className="profile-more">
                    <MoreSquareIcon />
                </button>


            </div>


        </aside>
    );
}

export default Sidebar;