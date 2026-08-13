import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "../styles/Orders.css";

import SearchIcon from "../components/dashboard/icons/SearchIcon";
import ChevronDownIcon from "../components/dashboard/icons/ChevronDownIcon";
import Swal from "sweetalert2";

function Orders() {

    // =========================================
    // ORDERS
    // =========================================

    const [orders, setOrders] = useState([]);

    // =========================================
    // DASHBOARD STATS
    // =========================================

    const [stats, setStats] = useState({
        pendingOrders: 0,
        completedOrders: 0,
        newOrders: 0,
        totalOrders: 0
    });

    // =========================================
    // LOADING / ERROR
    // =========================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // SEARCH + FILTERS
    // =========================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    // =========================================
    // ACTION MENU
    // =========================================

    const [openMenu, setOpenMenu] = useState(null);

    // =========================================
    // PAGINATION
    // =========================================

    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 9;


    // =========================================
    // FETCH ORDERS + STATS
    // =========================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const token = localStorage.getItem("token");

                // =========================================
                // FETCH ORDERS
                // =========================================

                const ordersResponse = await fetch(
                    "http://localhost:5000/api/orders",
                    {
                        method: "GET",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const ordersData = await ordersResponse.json();

                if (!ordersResponse.ok) {

                    throw new Error(
                        ordersData.message ||
                        "Failed to fetch orders"
                    );

                }

                setOrders(ordersData.orders || []);


                // =========================================
                // FETCH STATS
                // =========================================

                const statsResponse = await fetch(
                    "http://localhost:5000/api/dashboard/stats",
                    {
                        method: "GET",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const statsData = await statsResponse.json();

                if (!statsResponse.ok) {

                    throw new Error(
                        statsData.message ||
                        "Failed to fetch dashboard stats"
                    );

                }

                setStats(
                    statsData.stats || {
                        pendingOrders: 0,
                        completedOrders: 0,
                        newOrders: 0,
                        totalOrders: 0
                    }
                );

            } catch (error) {

                console.error(error);

                setError(error.message);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);


    // =========================================
    // DATE FORMAT
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const newDate = new Date(date);

        const day = String(
            newDate.getDate()
        ).padStart(2, "0");

        const month = String(
            newDate.getMonth() + 1
        ).padStart(2, "0");

        const year = newDate.getFullYear();

        return `${day}-${month}-${year}`;
    };


    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {

        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


    // =========================================
    // STATUS DISPLAY
    // =========================================

    const formatStatus = (status) => {

        if (!status) {
            return "-";
        }

        return status
            .split(" ")
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    };


    // =========================================
    // FILTER ORDERS
    // =========================================

    const filteredOrders = orders.filter((order) => {

        // =========================================
        // SEARCH
        // =========================================

        const searchValue = search.toLowerCase().trim();

        const matchesSearch =
            searchValue === "" ||

            String(order.id)
                .toLowerCase()
                .includes(searchValue) ||

            String(order.customer || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(order.phone || "")
                .toLowerCase()
                .includes(searchValue);


        // =========================================
        // STATUS FILTER
        // =========================================

        const orderStatus =
            String(order.status || "").toLowerCase();

        const matchesStatus =
            statusFilter === "all" ||
            orderStatus === statusFilter;


        // =========================================
        // DATE FILTER
        // =========================================

        let matchesDate = true;

        if (dateFilter !== "all" && order.created_at) {

            const orderDate = new Date(
                order.created_at
            );

            const now = new Date();

            // Today
            if (dateFilter === "today") {

                matchesDate =
                    orderDate.toDateString() ===
                    now.toDateString();

            }

            // Last 7 Days
            if (dateFilter === "7days") {

                const sevenDaysAgo =
                    new Date();

                sevenDaysAgo.setDate(
                    now.getDate() - 7
                );

                matchesDate =
                    orderDate >= sevenDaysAgo &&
                    orderDate <= now;

            }

            // Last 30 Days
            if (dateFilter === "30days") {

                const thirtyDaysAgo =
                    new Date();

                thirtyDaysAgo.setDate(
                    now.getDate() - 30
                );

                matchesDate =
                    orderDate >= thirtyDaysAgo &&
                    orderDate <= now;

            }

        }


        return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
        );

    });


    // =========================================
    // ACTIVE ORDERS
    // =========================================

    const activeOrders = orders.filter((order) => {

        const status =
            order.status?.toLowerCase();

        return (
            status === "pending" ||
            status === "new" ||
            status === "in process"
        );

    }).length;


    // =========================================
    // PAGINATION
    // =========================================

    const totalPages = Math.ceil(
        filteredOrders.length / ordersPerPage
    );


    const startIndex =
        (currentPage - 1) * ordersPerPage;


    const currentOrders =
        filteredOrders.slice(
            startIndex,
            startIndex + ordersPerPage
        );


    // =========================================
    // RESET PAGE WHEN FILTER CHANGES
    // =========================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        statusFilter,
        dateFilter
    ]);


    // =========================================
    // PAGE CHANGE
    // =========================================

    const changePage = (page) => {

        if (
            page >= 1 &&
            page <= totalPages
        ) {

            setCurrentPage(page);

        }

    };


    // =========================================
    // DELETE ORDER
    // =========================================

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Order?",
            text: "This order will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            reverseButtons: true,
            borderRadius: "18px"
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete order"
                );
            }

            setOrders((prevOrders) =>
                prevOrders.filter(
                    (order) => order.id !== id
                )
            );

            setOpenMenu(null);

            Swal.fire({
                icon: "success",
                title: "Order Deleted!",
                text: "The order has been deleted successfully.",
                confirmButtonText: "OK",
                confirmButtonColor: "#2f5138",
                timer: 1800,
                timerProgressBar: true
            });

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: error.message || "Something went wrong.",
                confirmButtonText: "OK",
                confirmButtonColor: "#2f5138"
            });
        }
    };


    // =========================================
    // VIEW ORDER
    // =========================================

    const handleView = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch order"
                );
            }

            const order = data.order;

            Swal.fire({
                title: `Order #${order.id}`,
                html: `
                <div style="text-align:left; line-height:1.9;">
                    <p><strong>Customer:</strong> ${order.customer}</p>
                    <p><strong>Phone:</strong> ${order.phone || "-"}</p>
                    <p><strong>Items:</strong> ${order.items}</p>
                    <p><strong>Amount:</strong> Rs. ${Number(order.amount || 0).toFixed(2)}</p>
                    <p><strong>Status:</strong> ${formatStatus(order.status)}</p>
                </div>
            `,
                icon: "info",
                confirmButtonText: "Close",
                confirmButtonColor: "#2f5138",
                width: "420px",
                customClass: {
                    popup: "order-view-popup",
                    title: "order-view-title",
                    confirmButton: "order-view-button"
                }
            });

            setOpenMenu(null);

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Unable to load order",
                text: error.message || "Something went wrong.",
                confirmButtonText: "OK",
                confirmButtonColor: "#2f5138"
            });
        }
    };


    // =========================================
    // EDIT ORDER
    // =========================================

    const handleEdit = async (order) => {

        const result = await Swal.fire({
            title: `Edit Order #${order.id}`,

            html: `
            <div class="edit-order-form">

                <label>Status</label>

                <select id="edit-status">
                    <option value="new" ${order.status === "new" ? "selected" : ""
                }>New</option>

                    <option value="pending" ${order.status === "pending" ? "selected" : ""
                }>Pending</option>

                    <option value="in process" ${order.status === "in process" ? "selected" : ""
                }>In Process</option>

                    <option value="completed" ${order.status === "completed" ? "selected" : ""
                }>Completed</option>

                    <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""
                }>Cancelled</option>
                </select>


                <label>Items</label>

                <input
                    id="edit-items"
                    type="number"
                    min="1"
                    value="${order.items}"
                />


                <label>Amount</label>

                <input
                    id="edit-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value="${order.amount}"
                />

            </div>
        `,

            showCancelButton: true,

            confirmButtonText: "Save Changes",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#2f5138",

            cancelButtonColor: "#6c757d",

            width: "430px",

            reverseButtons: true,

            preConfirm: () => {

                const status =
                    document.getElementById("edit-status").value;

                const items =
                    document.getElementById("edit-items").value;

                const amount =
                    document.getElementById("edit-amount").value;


                if (!status || !items || amount === "") {

                    Swal.showValidationMessage(
                        "Please fill all fields"
                    );

                    return false;
                }


                if (Number(items) < 1) {

                    Swal.showValidationMessage(
                        "Items must be at least 1"
                    );

                    return false;
                }


                if (Number(amount) < 0) {

                    Swal.showValidationMessage(
                        "Amount cannot be negative"
                    );

                    return false;
                }


                return {
                    status,
                    items: Number(items),
                    amount: Number(amount)
                };
            }
        });


        if (!result.isConfirmed) return;


        try {

            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `http://localhost:5000/api/orders/${order.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: result.value.status,
                        items: result.value.items,
                        amount: result.value.amount
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update order"
                );
            }


            setOrders((prevOrders) =>
                prevOrders.map((item) =>
                    item.id === order.id
                        ? {
                            ...item,

                            status:
                                result.value.status,

                            items:
                                result.value.items,

                            amount:
                                result.value.amount
                        }
                        : item
                )
            );


            setOpenMenu(null);


            Swal.fire({
                icon: "success",

                title: "Order Updated!",

                text:
                    "Order details have been updated successfully.",

                confirmButtonText: "OK",

                confirmButtonColor: "#2f5138",

                timer: 1800,

                timerProgressBar: true
            });


        } catch (error) {

            console.error(error);


            Swal.fire({
                icon: "error",

                title: "Update Failed",

                text:
                    error.message ||
                    "Something went wrong.",

                confirmButtonText: "OK",

                confirmButtonColor: "#2f5138"
            });
        }
    };

    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="dashboard-layout">


            {/* SIDEBAR */}

            <Sidebar />


            {/* MAIN CONTENT */}

            <main className="dashboard-main">


                <DashboardHeader />


                {/* =========================================
                    ORDERS HEADING + FILTERS
                ========================================= */}

                <div className="orders-title-row">

                    <h1>
                        Orders
                    </h1>


                    <div className="orders-filters">


                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="search-box">

                            <SearchIcon />

                            <input
                                type="text"
                                placeholder="Search Orders"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        {/* =========================================
                            STATUS FILTER
                        ========================================= */}

                        <div className="filter-box">

                            <ChevronDownIcon />

                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="all">
                                    Status
                                </option>

                                <option value="new">
                                    New
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="in process">
                                    In Process
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>

                            </select>

                        </div>


                        {/* =========================================
                            DATE FILTER
                        ========================================= */}

                        <div className="filter-box">

                            <ChevronDownIcon />

                            <select
                                className="filter-select"
                                value={dateFilter}
                                onChange={(e) =>
                                    setDateFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="all">
                                    Date
                                </option>

                                <option value="today">
                                    Today
                                </option>

                                <option value="7days">
                                    Last 7 Days
                                </option>

                                <option value="30days">
                                    Last 30 Days
                                </option>

                            </select>

                        </div>


                    </div>

                </div>


                {/* =========================================
                    ORDER STATISTICS
                ========================================= */}

                <div className="orders-stats">


                    {/* Pending */}

                    <div className="stat-card">

                        <span className="stat-title">
                            Pending Orders
                        </span>

                        <span className="stat-value">
                            {stats.pendingOrders}
                        </span>

                    </div>


                    {/* Completed */}

                    <div className="stat-card">

                        <span className="stat-title">
                            Completed Orders
                        </span>

                        <span className="stat-value">
                            {stats.completedOrders}
                        </span>

                    </div>


                    {/* New */}

                    <div className="stat-card">

                        <span className="stat-title">
                            New Orders
                        </span>

                        <span className="stat-value">
                            {stats.newOrders}
                        </span>

                    </div>


                    {/* Active */}

                    <div className="stat-card">

                        <span className="stat-title">
                            Active Orders
                        </span>

                        <span className="stat-value">
                            {activeOrders}
                        </span>

                    </div>


                </div>


                {/* =========================================
                    TABLE
                ========================================= */}

                <div className="orders-table-container">

                    <div className="orders-table">


                        {/* HEADER */}

                        <div className="table-header">

                            <div>Order ID</div>
                            <div>Customer</div>
                            <div>Phone</div>
                            <div>Items</div>
                            <div>Amount</div>
                            <div>Date</div>
                            <div>Status</div>
                            <div>Action</div>

                        </div>


                        {/* BODY */}

                        <div className="table-body">


                            {/* Loading */}

                            {loading && (

                                <div className="table-row">

                                    <div>
                                        Loading...
                                    </div>

                                </div>

                            )}


                            {/* Error */}

                            {!loading && error && (

                                <div className="table-row">

                                    <div>
                                        {error}
                                    </div>

                                </div>

                            )}


                            {/* No Results */}

                            {!loading &&
                                !error &&
                                filteredOrders.length === 0 && (

                                    <div className="table-row">

                                        <div>
                                            No orders found
                                        </div>

                                    </div>

                                )}


                            {/* ORDERS */}

                            {!loading &&
                                !error &&
                                currentOrders.map(
                                    (order) => (

                                        <div
                                            className="table-row"
                                            key={order.id}
                                        >

                                            {/* ID */}

                                            <div>
                                                #{order.id}
                                            </div>


                                            {/* Customer */}

                                            <div>
                                                {order.customer}
                                            </div>


                                            {/* Phone */}

                                            <div>
                                                {order.phone || "-"}
                                            </div>


                                            {/* Items */}

                                            <div>
                                                {order.items}
                                            </div>


                                            {/* Amount */}

                                            <div>
                                                {Number(
                                                    order.amount || 0
                                                ).toFixed(2)}
                                            </div>


                                            {/* Date */}

                                            <div>
                                                {formatDate(
                                                    order.created_at
                                                )}
                                            </div>


                                            {/* Status */}

                                            <div>

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                >

                                                    <span className="status-dot"></span>

                                                    {formatStatus(
                                                        order.status
                                                    )}

                                                </span>

                                            </div>


                                            {/* Action */}

                                            <div className="action-menu">

                                                <button
                                                    type="button"
                                                    className="action-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setOpenMenu(
                                                            openMenu === order.id
                                                                ? null
                                                                : order.id
                                                        );
                                                    }}
                                                >
                                                    ⋮
                                                </button>

                                                {openMenu === order.id && (

                                                    <div
                                                        className="action-dropdown"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() => handleView(order.id)}
                                                        >
                                                            View Order
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(order)}
                                                        >
                                                            Edit Order
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-action"
                                                            onClick={() => handleDelete(order.id)}
                                                        >
                                                            Delete Order
                                                        </button>

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}


                        </div>


                        {/* =========================================
                            PAGINATION
                        ========================================= */}

                        {totalPages > 0 && (

                            <div className="pagination">


                                {/* Previous */}

                                <button
                                    className="page-arrow"

                                    onClick={() =>
                                        changePage(
                                            currentPage - 1
                                        )
                                    }

                                    disabled={
                                        currentPage === 1
                                    }
                                >
                                    ←
                                </button>


                                {/* Pages */}

                                {Array.from(
                                    {
                                        length: totalPages
                                    },

                                    (_, index) =>
                                        index + 1

                                ).map((page) => (

                                    <button
                                        key={page}

                                        className={`page-number ${currentPage === page
                                            ? "active"
                                            : ""
                                            }`}

                                        onClick={() =>
                                            changePage(page)
                                        }
                                    >
                                        {page}
                                    </button>

                                ))}


                                {/* Next */}

                                <button
                                    className="page-arrow"

                                    onClick={() =>
                                        changePage(
                                            currentPage + 1
                                        )
                                    }

                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                >
                                    →
                                </button>


                            </div>

                        )}


                    </div>

                </div>


            </main>

        </div>

    );

}

export default Orders;