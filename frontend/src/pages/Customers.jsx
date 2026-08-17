
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Icon } from "@iconify/react";
import "../styles/Customers.css";

function Customers() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [openAction, setOpenAction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const customersPerPage = 9;

    // Temporary data - backend connect baad mein karenge
    const customers = [
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
        {
            id: "#435355214141",
            name: "Abdullah",
            phone: "+923173008513",
            email: "customeremail@gmail.com",
            orders: 2,
            status: "active",
        },
    ];

    const filteredCustomers = customers.filter((customer) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            customer.name.toLowerCase().includes(searchText) ||
            customer.email.toLowerCase().includes(searchText) ||
            customer.phone.toLowerCase().includes(searchText) ||
            customer.id.toLowerCase().includes(searchText);

        const matchesStatus =
            statusFilter === "all" ||
            customer.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCustomers.length / customersPerPage)
    );

    const startIndex = (currentPage - 1) * customersPerPage;

    const paginatedCustomers = filteredCustomers.slice(
        startIndex,
        startIndex + customersPerPage
    );

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="customers-main">

                <DashboardHeader />

                <section className="customers-content">

                    {/* TOP SECTION */}
                    <div className="customers-top">

                        <h2>Customers</h2>

                        <div className="customers-filters">

                            {/* SEARCH */}
                            <div className="customer-search">

                                <Icon icon="mdi:magnify" />

                                <input
                                    type="text"
                                    placeholder="Search Orders"
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
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                <Icon icon="mdi:chevron-down" />

                            </div>

                            {/* DATE */}
                            <div className="customer-filter">

                                <select
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">Date</option>
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                </select>

                                <Icon icon="mdi:chevron-down" />

                            </div>

                        </div>

                    </div>


                    {/* STAT CARDS */}
                    <div className="customer-stats">

                        <div className="customer-stat-card">
                            <p>Pending Orders</p>
                            <h3>15</h3>
                        </div>

                        <div className="customer-stat-card">
                            <p>Completed Orders</p>
                            <h3>6</h3>
                        </div>

                        <div className="customer-stat-card">
                            <p>Completed Orders</p>
                            <h3>6</h3>
                        </div>

                        <div className="customer-stat-card">
                            <p>Active Orders</p>
                            <h3>6</h3>
                        </div>

                    </div>


                    {/* TABLE */}
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

                                {paginatedCustomers.map((customer, index) => (

                                    <tr key={`${customer.id}-${index}`}>

                                        <td>{customer.id}</td>

                                        <td>{customer.name}</td>

                                        <td>{customer.phone}</td>

                                        <td>{customer.email}</td>

                                        <td>{customer.orders}</td>

                                        <td className="customer-action-cell">

                                            <button
                                                className="customer-action-btn"
                                                onClick={() =>
                                                    setOpenAction(
                                                        openAction === index
                                                            ? null
                                                            : index
                                                    )
                                                }
                                            >
                                                ⋮
                                            </button>


                                            {openAction === index && (

                                                <div className="customer-action-menu">

                                                    <button type="button">
                                                        <Icon icon="mdi:eye-outline" />
                                                        <span>View</span>
                                                    </button>

                                                    <button type="button">
                                                        <Icon icon="mdi:pencil-outline" />
                                                        <span>Edit</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-action"
                                                    >
                                                        <Icon icon="mdi:trash-can-outline" />
                                                        <span>Delete</span>
                                                    </button>

                                                </div>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                                {paginatedCustomers.length === 0 && (

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


                        {/* PAGINATION */}
                        <div className="customer-pagination">

                            <button
                                className="customer-pagination-arrow"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                            >
                                ←
                            </button>


                            {[1, 2, 3].map((page) => (

                                <button
                                    key={page}
                                    className={`customer-pagination-number ${
                                        currentPage === page
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                >
                                    {page}
                                </button>

                            ))}


                            <span className="customer-pagination-dots">
                                ...
                            </span>


                            <button
                                className="customer-pagination-number"
                                onClick={() =>
                                    setCurrentPage(Math.max(totalPages - 2, 1))
                                }
                            >
                                8
                            </button>

                            <button
                                className="customer-pagination-number"
                                onClick={() =>
                                    setCurrentPage(Math.max(totalPages - 1, 1))
                                }
                            >
                                9
                            </button>

                            <button
                                className="customer-pagination-number"
                                onClick={() =>
                                    setCurrentPage(totalPages)
                                }
                            >
                                10
                            </button>


                            <button
                                className="customer-pagination-arrow"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
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
