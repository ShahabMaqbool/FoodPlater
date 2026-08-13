import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

import "../styles/Categories.css";

function Categories() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Temporary data
  // Database connect karne ke baad ye remove karke API data ayega
  const categories = [
    {
      id: 1,
      name: "Burger",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "active"
    },
    {
      id: 2,
      name: "Pizza",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "inactive"
    },
    {
      id: 3,
      name: "Drinks",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "active"
    },
    {
      id: 4,
      name: "Desserts",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "inactive"
    },
    {
      id: 5,
      name: "Sandwiches",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "active"
    },
    {
      id: 6,
      name: "Pasta",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "active"
    },
    {
      id: 7,
      name: "Salads",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "inactive"
    },
    {
      id: 8,
      name: "Chicken",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "active"
    },
    {
      id: 9,
      name: "Deals",
      description: "Lorem Ipsum is simply dummy text of the printin...",
      items: 6,
      status: "inactive"
    }
  ];


  // Search + Status Filter
  const filteredCategories = categories.filter((category) => {

    const matchesSearch =
      category.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      category.description
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "all" ||
      category.status === statusFilter;


    return matchesSearch && matchesStatus;

  });


  return (

    <div className="dashboard-layout">

      {/* Sidebar */}
      <Sidebar />


      {/* Main */}
      <main className="categories-main">

        {/* Header */}
        <DashboardHeader />


        {/* Page Content */}
        <section className="categories-content">


          {/* Page Heading + Filters */}

          <div className="categories-top">

            <h2>Categories</h2>


            <div className="categories-filters">


              {/* Search */}

              <div className="category-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search Categories"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              {/* Status */}

              <div className="category-filter">

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
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

                <span>⌄</span>

              </div>


              {/* Date */}

              <div className="category-filter">

                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value)
                  }
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

                <span>⌄</span>

              </div>

            </div>

          </div>


          {/* Stats */}

          <div className="category-stats">


            <div className="category-stat-card">

              <p>Total Categories</p>

              <h3>25</h3>

            </div>


            <div className="category-stat-card">

              <p>Active Categories</p>

              <h3>6</h3>

            </div>


            <div className="category-stat-card">

              <p>Inactive Categories</p>

              <h3>11</h3>

            </div>


          </div>


          {/* Table */}

          <div className="category-table-container">

            <table className="category-table">

              <thead>

                <tr>

                  <th>Category Name</th>

                  <th>Description</th>

                  <th>Items</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {filteredCategories.map((category) => (

                  <tr key={category.id}>


                    {/* Category Name */}

                    <td>
                      {category.name}
                    </td>


                    {/* Description */}

                    <td className="category-description">
                      {category.description}
                    </td>


                    {/* Items */}

                    <td>
                      {category.items}
                    </td>


                    {/* Status */}

                    <td>

                      <span
                        className={
                          category.status === "active"
                            ? "category-status active"
                            : "category-status inactive"
                        }
                      >

                        <span className="category-status-dot"></span>

                        {category.status === "active"
                          ? "Active"
                          : "Inactive"}

                      </span>

                    </td>


                    {/* Action */}

                    <td>

                      <button className="category-action-btn">
                        ⋮
                      </button>

                    </td>


                  </tr>

                ))}


                {filteredCategories.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="category-no-data"
                    >
                      No categories found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>


            {/* Pagination */}

            <div className="category-pagination">

              <button className="category-pagination-arrow">
                ←
              </button>

              <button className="category-pagination-number active">
                1
              </button>

              <button className="category-pagination-number">
                2
              </button>

              <button className="category-pagination-number">
                3
              </button>

              <span>...</span>

              <button className="category-pagination-number">
                8
              </button>

              <button className="category-pagination-number">
                9
              </button>

              <button className="category-pagination-number">
                10
              </button>

              <button className="category-pagination-arrow">
                →
              </button>

            </div>

          </div>


        </section>

      </main>

    </div>

  );
}

export default Categories;