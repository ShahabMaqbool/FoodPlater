import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "../styles/MenuItems.css";

function MenuItems() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const menuItems = [
    {
      id: 25,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "in stock",
      date: "08-12-2024"
    },
    {
      id: 24,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "out of stock",
      date: "08-12-2024"
    },
    {
      id: 23,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "in stock",
      date: "08-12-2024"
    },
    {
      id: 22,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "in stock",
      date: "08-12-2024"
    },
    {
      id: 21,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "in stock",
      date: "08-12-2024"
    },
    {
      id: 20,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "out of stock",
      date: "04-30-2025"
    },
    {
      id: 19,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "in stock",
      date: "11-05-2024"
    },
    {
      id: 18,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "out of stock",
      date: "07-22-2025"
    },
    {
      id: 17,
      name: "Burger",
      category: "Burgers",
      price: 120,
      status: "in stock",
      date: "01-18-2024"
    }
  ];

  const filteredItems = menuItems.filter((item) => {

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="menu-items-main">

        {/* Header */}
        <DashboardHeader />

        {/* Page Header */}
        <section className="menu-items-content">

          <div className="menu-items-top">

            <h2>Menu Items</h2>

            <div className="menu-items-filters">

              {/* Search */}
              <div className="menu-search">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search Orders"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="menu-filter">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Status</option>
                  <option value="in stock">In Stock</option>
                  <option value="out of stock">Out Of Stock</option>
                </select>

                <span>⌄</span>
              </div>

              {/* Date */}
              <div className="menu-filter">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">Date</option>
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>

                <span>⌄</span>
              </div>

            </div>

          </div>

          {/* Stats */}
          <div className="menu-stats">

            <div className="menu-stat-card">
              <p>Total Items</p>
              <h3>25</h3>
            </div>

            <div className="menu-stat-card">
              <p>Instock Items</p>
              <h3>6</h3>
            </div>

            <div className="menu-stat-card">
              <p>Out Of Stock Items</p>
              <h3>11</h3>
            </div>

          </div>

          {/* Table */}
          <div className="menu-table-container">

            <table className="menu-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredItems.map((item) => (

                  <tr key={item.id}>

                    <td>#{item.id}</td>

                    <td>
                      <div className="menu-item-name">

                        <div className="burger-image">
                          <img src="/burger.png" alt="Burger"/>
                        </div>

                        <span>{item.name}</span>

                      </div>
                    </td>

                    <td>{item.category}</td>

                    <td>Rs {item.price}</td>

                    <td>
                      <span
                        className={
                          item.status === "in stock"
                            ? "menu-status in-stock"
                            : "menu-status out-stock"
                        }
                      >
                        <span className="status-dot"></span>
                        {item.status === "in stock"
                          ? "In Stock"
                          : "Out Of Stock"}
                      </span>
                    </td>

                    <td>{item.date}</td>

                    <td>
                      <button className="menu-action-btn">
                        ⋮
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {/* Pagination */}
            <div className="menu-pagination">

              <button className="pagination-arrow">
                ←
              </button>

              <button className="pagination-number active">
                1
              </button>

              <button className="pagination-number">
                2
              </button>

              <button className="pagination-number">
                3
              </button>

              <span>...</span>

              <button className="pagination-number">
                8
              </button>

              <button className="pagination-number">
                9
              </button>

              <button className="pagination-number">
                10
              </button>

              <button className="pagination-arrow">
                →
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default MenuItems;