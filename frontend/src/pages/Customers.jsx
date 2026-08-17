import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../styles/Customers.css";

function Customers() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [openAction, setOpenAction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const customersPerPage = 9;

    const [stats, setStats] = useState({
        pending_orders: 0,
        completed_orders: 0,
        total_customers: 0,
        active_customers: 0
    });

    // ==========================================
    // FETCH CUSTOMERS
    // ==========================================

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/customers",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch customers");
            }

            setCustomers(data.customers || []);
        } catch (error) {
            console.error("Failed to fetch customers:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load customers.",
                confirmButtonColor: "#2f4a35",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/customers/stats",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch customer stats"
                );
            }

            setStats(data.stats);

        } catch (error) {
            console.error(
                "Failed to fetch customer stats:",
                error
            );
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchCustomerStats();
    }, []);

    // ==========================================
    // FILTER CUSTOMERS
    // ==========================================

    const filteredCustomers = customers
        .filter((customer) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                (customer.name || "").toLowerCase().includes(searchText) ||
                (customer.email || "").toLowerCase().includes(searchText) ||
                (customer.phone || "").toLowerCase().includes(searchText) ||
                String(customer.id).includes(searchText);

            // Status currently based on order count
            const orderCount = Number(customer.orders || 0);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && orderCount > 0) ||
                (statusFilter === "inactive" && orderCount === 0);

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (dateFilter === "latest") {
                return (
                    new Date(b.created_at) -
                    new Date(a.created_at)
                );
            }

            if (dateFilter === "oldest") {
                return (
                    new Date(a.created_at) -
                    new Date(b.created_at)
                );
            }

            return 0;
        });

    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCustomers.length / customersPerPage)
    );

    const startIndex = (currentPage - 1) * customersPerPage;

    const paginatedCustomers = filteredCustomers.slice(
        startIndex,
        startIndex + customersPerPage
    );

    // ==========================================
    // VIEW CUSTOMER
    // ==========================================

    const handleView = async (customer) => {
        setOpenAction(null);

        Swal.fire({
            title: "Customer Details",
            html: `
                <div style="
                    text-align:left;
                    font-family:Arial,sans-serif;
                    line-height:1.8;
                ">
                    <p>
                        <strong>Customer ID:</strong>
                        ${customer.id}
                    </p>

                    <p>
                        <strong>Name:</strong>
                        ${customer.name || "-"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${customer.email || "-"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${customer.phone || "-"}
                    </p>

                    <p>
                        <strong>Orders:</strong>
                        ${customer.orders || 0}
                    </p>

                    <p>
                        <strong>Created:</strong>
                        ${customer.created_at
                    ? new Date(
                        customer.created_at
                    ).toLocaleDateString()
                    : "-"
                }
                    </p>
                </div>
            `,
            confirmButtonText: "Close",
            confirmButtonColor: "#2f4a35",
        });
    };

    // ==========================================
    // EDIT CUSTOMER
    // ==========================================

    const handleEdit = async (customer) => {
        setOpenAction(null);

        const result = await Swal.fire({
            title: "Edit Customer",

            html: `
                <input
                    id="swal-name"
                    class="swal2-input"
                    placeholder="Customer Name"
                    value="${customer.name || ""}"
                />

                <input
                    id="swal-email"
                    class="swal2-input"
                    placeholder="Email"
                    type="email"
                    value="${customer.email || ""}"
                />

                <input
                    id="swal-phone"
                    class="swal2-input"
                    placeholder="Phone"
                    value="${customer.phone || ""}"
                />
            `,

            confirmButtonText: "Update Customer",
            cancelButtonText: "Cancel",
            showCancelButton: true,

            confirmButtonColor: "#2f4a35",
            cancelButtonColor: "#777",

            focusConfirm: false,

            preConfirm: () => {
                const name =
                    document.getElementById("swal-name").value.trim();

                const email =
                    document.getElementById("swal-email").value.trim();

                const phone =
                    document.getElementById("swal-phone").value.trim();

                if (!name || !email) {
                    Swal.showValidationMessage(
                        "Name and Email are required"
                    );

                    return false;
                }

                return {
                    name,
                    email,
                    phone,
                };
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/customers/${customer.id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(result.value),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update customer"
                );
            }

            await Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Customer updated successfully.",
                confirmButtonColor: "#2f4a35",
                timer: 1800,
                showConfirmButton: false,
            });

            fetchCustomers();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message,
                confirmButtonColor: "#2f4a35",
            });
        }
    };

    // ==========================================
    // DELETE CUSTOMER
    // ==========================================

    const handleDelete = async (customer) => {
        setOpenAction(null);

        const result = await Swal.fire({
            title: "Are you sure?",
            html: `
                You are about to delete
                <strong>${customer.name}</strong>.
                <br/>
                This action cannot be undone.
            `,
            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",

            confirmButtonColor: "#d33",
            cancelButtonColor: "#777",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/customers/${customer.id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete customer"
                );
            }

            await Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Customer deleted successfully.",
                confirmButtonColor: "#2f4a35",
                timer: 1800,
                showConfirmButton: false,
            });

            // Refresh customers
            fetchCustomers();

            // Reset page if needed
            setCurrentPage(1);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: error.message,
                confirmButtonColor: "#2f4a35",
            });
        }
    };

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="customers-main">

                <DashboardHeader />

                <section className="customers-content">

                    {/* =====================================
                        TOP SECTION
                    ====================================== */}

                    <div className="customers-top">

                        <h2>Customers</h2>

                        <div className="customers-filters">

                            {/* SEARCH */}

                            <div className="customer-search">

                                <Icon icon="mdi:magnify" />

                                <input
                                    type="text"
                                    placeholder="Search Customers"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />

                            </div>


                            {/* STATUS */}

                            <div className="customer-filter">

                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">
                                        Status
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>

                                <Icon icon="mdi:chevron-down" />

                            </div>


                            {/* DATE */}

                            <div className="customer-filter">

                                <select
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">
                                        Date
                                    </option>

                                    <option value="latest">
                                        Latest
                                    </option>

                                    <option value="oldest">
                                        Oldest
                                    </option>
                                </select>

                                <Icon icon="mdi:chevron-down" />

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        STAT CARDS
                    ====================================== */}

                    <div className="customer-stats">

                        <div className="customer-stat-card">
                            <p>Pending Orders</p>
                            <h3>{stats.pending_orders}</h3>
                        </div>

                        <div className="customer-stat-card">
                            <p>Completed Orders</p>
                            <h3>{stats.completed_orders}</h3>
                        </div>

                        <div className="customer-stat-card">
                            <p>Total Customers</p>
                            <h3>{stats.total_customers}</h3>
                        </div>

                        <div className="customer-stat-card">
                            <p>Active Customers</p>
                            <h3>{stats.active_customers}</h3>
                        </div>

                    </div>


                    {/* =====================================
                        TABLE
                    ====================================== */}

                    <div className="customer-table-container">

                        <table className="customer-table">

                            <thead>

                                <tr>
                                    <th>Customer ID</th>
                                    <th>Customer Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Orders</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="customer-no-data"
                                        >
                                            Loading customers...
                                        </td>
                                    </tr>

                                ) : (

                                    paginatedCustomers.map(
                                        (customer) => (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                            >

                                                <td>
                                                    {customer.id}
                                                </td>

                                                <td>
                                                    {customer.name}
                                                </td>

                                                <td>
                                                    {customer.phone ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {customer.email}
                                                </td>

                                                <td>
                                                    {customer.orders ||
                                                        0}
                                                </td>


                                                {/* ACTION */}

                                                <td className="customer-action-cell">

                                                    <button
                                                        className="customer-action-btn"
                                                        onClick={() =>
                                                            setOpenAction(
                                                                openAction ===
                                                                    customer.id
                                                                    ? null
                                                                    : customer.id
                                                            )
                                                        }
                                                    >
                                                        ⋮
                                                    </button>


                                                    {openAction ===
                                                        customer.id && (

                                                            <div className="customer-action-menu">

                                                                {/* VIEW */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            customer
                                                                        )
                                                                    }
                                                                >
                                                                    <Icon icon="mdi:eye-outline" />

                                                                    <span>
                                                                        View
                                                                    </span>
                                                                </button>


                                                                {/* EDIT */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            customer
                                                                        )
                                                                    }
                                                                >
                                                                    <Icon icon="mdi:pencil-outline" />

                                                                    <span>
                                                                        Edit
                                                                    </span>
                                                                </button>


                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    className="delete-action"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            customer
                                                                        )
                                                                    }
                                                                >
                                                                    <Icon icon="mdi:trash-can-outline" />

                                                                    <span>
                                                                        Delete
                                                                    </span>
                                                                </button>

                                                            </div>

                                                        )}

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}


                                {!loading &&
                                    paginatedCustomers.length ===
                                    0 && (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="customer-no-data"
                                            >
                                                No customers found.
                                            </td>

                                        </tr>

                                    )}

                            </tbody>

                        </table>


                        {/* =====================================
                            PAGINATION
                        ====================================== */}

                        <div className="customer-pagination">

                            <button
                                className="customer-pagination-arrow"
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            Math.max(
                                                prev - 1,
                                                1
                                            )
                                    )
                                }
                            >
                                ←
                            </button>


                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (

                                <button
                                    key={page}
                                    className={`customer-pagination-number ${currentPage === page
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setCurrentPage(
                                            page
                                        )
                                    }
                                >
                                    {page}
                                </button>

                            ))}


                            <button
                                className="customer-pagination-arrow"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            Math.min(
                                                prev + 1,
                                                totalPages
                                            )
                                    )
                                }
                            >
                                →
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Customers;