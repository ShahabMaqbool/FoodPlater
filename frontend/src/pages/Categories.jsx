import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Icon } from "@iconify/react";
import "../styles/Categories.css";
import Swal from "sweetalert2";

function Categories() {

  // =========================
  // STATES
  // =========================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [categories, setCategories] = useState([]);

  const [openAction, setOpenAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const categoriesPerPage = 9;


  // =========================
  // FETCH CATEGORIES
  // =========================

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/categories",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {

          console.error(data.message);

          return;
        }

        setCategories(data.categories);

      } catch (error) {

        console.error(
          "Failed to fetch categories:",
          error
        );

      }

    };

    fetchCategories();

  }, []);


  // =========================
  // VIEW CATEGORY
  // =========================

  const handleView = (category) => {

    Swal.fire({

      title: category.category_name,

      html: `
        <div style="
          text-align:left;
          font-size:14px;
          line-height:1.8;
        ">

          <p>
            <strong>Description:</strong>
            ${category.description || "N/A"}
          </p>

          <p>
            <strong>Items:</strong>
            ${category.item_count}
          </p>

          <p>
            <strong>Status:</strong>
            ${category.status === "active"
          ? "Active"
          : "Inactive"
        }
          </p>

          <p>
            <strong>Created:</strong>
            ${category.created_at
          ? new Date(
            category.created_at
          ).toLocaleDateString()
          : "N/A"
        }
          </p>

        </div>
      `,

      confirmButtonColor: "#2F4A35",

      confirmButtonText: "Close"

    });

  };


  // =========================
  // EDIT CATEGORY
  // =========================

  const handleEdit = async (category) => {

    const { value: formValues } = await Swal.fire({

      title: "Edit Category",

      html: `

        <input
          id="swal-category-name"
          class="swal2-input"
          placeholder="Category Name"
          value="${category.category_name}"
        />

        <textarea
          id="swal-description"
          class="swal2-textarea"
          placeholder="Description"
        >${category.description || ""}</textarea>

        <input
          id="swal-item-count"
          class="swal2-input"
          type="number"
          min="0"
          placeholder="Items"
          value="${category.item_count}"
        />

        <select
          id="swal-status"
          class="swal2-select"
        >

          <option
            value="active"
            ${category.status === "active"
          ? "selected"
          : ""
        }
          >
            Active
          </option>

          <option
            value="inactive"
            ${category.status === "inactive"
          ? "selected"
          : ""
        }
          >
            Inactive
          </option>

        </select>

      `,

      focusConfirm: false,

      showCancelButton: true,

      confirmButtonText: "Update",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#2F4A35",

      preConfirm: () => {

        const category_name =
          document.getElementById(
            "swal-category-name"
          ).value;

        const description =
          document.getElementById(
            "swal-description"
          ).value;

        const item_count =
          document.getElementById(
            "swal-item-count"
          ).value;

        const status =
          document.getElementById(
            "swal-status"
          ).value;


        if (!category_name.trim()) {

          Swal.showValidationMessage(
            "Category name is required"
          );

          return false;
        }


        return {

          category_name:
            category_name.trim(),

          description:
            description.trim(),

          item_count:
            Number(item_count) || 0,

          status

        };

      }

    });


    // Cancel pressed
    if (!formValues) {

      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(

        `http://localhost:5000/api/categories/${category.id}`,

        {

          method: "PUT",

          headers: {

            "Authorization":
              `Bearer ${token}`,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(formValues)

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        Swal.fire({

          icon: "error",

          title: "Update Failed",

          text:
            data.message ||
            "Failed to update category"

        });

        return;
      }


      // Update frontend table
      setCategories(
        (prevCategories) =>
          prevCategories.map(
            (item) =>
              item.id === category.id
                ? data.category
                : item
          )
      );


      setOpenAction(null);


      Swal.fire({

        icon: "success",

        title: "Updated!",

        text:
          "Category updated successfully.",

        confirmButtonColor:
          "#2F4A35"

      });


    } catch (error) {

      console.error(error);


      Swal.fire({

        icon: "error",

        title: "Error",

        text:
          "Something went wrong."

      });

    }

  };


  // =========================
  // DELETE CATEGORY
  // =========================

  const handleDelete = async (category) => {

    const result =
      await Swal.fire({

        title:
          "Delete Category?",

        text:
          `Are you sure you want to delete "${category.category_name}"?`,

        icon:
          "warning",

        showCancelButton:
          true,

        confirmButtonColor:
          "#e94d5b",

        cancelButtonColor:
          "#6c757d",

        confirmButtonText:
          "Yes, Delete",

        cancelButtonText:
          "Cancel"

      });


    if (!result.isConfirmed) {

      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      const response =
        await fetch(

          `http://localhost:5000/api/categories/${category.id}`,

          {

            method: "DELETE",

            headers: {

              "Authorization":
                `Bearer ${token}`,

              "Content-Type":
                "application/json"

            }

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        Swal.fire({

          icon:
            "error",

          title:
            "Delete Failed",

          text:
            data.message ||
            "Failed to delete category"

        });

        return;
      }


      // Remove from frontend
      setCategories(
        (prevCategories) =>
          prevCategories.filter(
            (item) =>
              item.id !== category.id
          )
      );


      setOpenAction(null);


      Swal.fire({

        icon:
          "success",

        title:
          "Deleted!",

        text:
          "Category deleted successfully.",

        confirmButtonColor:
          "#2F4A35"

      });


    } catch (error) {

      console.error(error);


      Swal.fire({

        icon:
          "error",

        title:
          "Error",

        text:
          "Something went wrong."

      });

    }

  };


  // =========================
  // SEARCH + FILTER + DATE
  // =========================

  const filteredCategories =
    categories

      .filter((category) => {

        const matchesSearch =

          category.category_name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          (category.description || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );


        const matchesStatus =

          statusFilter === "all" ||

          category.status ===
          statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );

      })


      .sort((a, b) => {

        if (
          dateFilter === "latest"
        ) {

          return (
            new Date(b.created_at) -
            new Date(a.created_at)
          );

        }


        if (
          dateFilter === "oldest"
        ) {

          return (
            new Date(a.created_at) -
            new Date(b.created_at)
          );

        }


        return 0;

      });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredCategories.length / categoriesPerPage
  );

  const startIndex =
    (currentPage - 1) * categoriesPerPage;

  const paginatedCategories =
    filteredCategories.slice(
      startIndex,
      startIndex + categoriesPerPage
    );


  // =========================
  // JSX
  // =========================

  return (

    <div className="dashboard-layout">


      {/* SIDEBAR */}

      <Sidebar />


      {/* MAIN */}

      <main className="categories-main">


        {/* HEADER */}

        <DashboardHeader />


        {/* CONTENT */}

        <section className="categories-content">


          {/* PAGE HEADING + FILTERS */}

          <div className="categories-top">


            <h2>
              Categories
            </h2>


            <div className="categories-filters">


              {/* SEARCH */}

              <div className="category-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search Categories"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* STATUS */}

              <div className="category-filter">

                <select
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

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

                <span>
                  ⌄
                </span>

              </div>


              {/* DATE */}

              <div className="category-filter">

                <select
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

                  <option value="latest">
                    Latest
                  </option>

                  <option value="oldest">
                    Oldest
                  </option>

                </select>

                <span>
                  ⌄
                </span>

              </div>


            </div>

          </div>


          {/* STATS */}

          <div className="category-stats">


            {/* TOTAL */}

            <div className="category-stat-card">

              <p>
                Total Categories
              </p>

              <h3>
                {categories.length}
              </h3>

            </div>


            {/* ACTIVE */}

            <div className="category-stat-card">

              <p>
                Active Categories
              </p>

              <h3>

                {
                  categories.filter(
                    (category) =>
                      category.status ===
                      "active"
                  ).length
                }

              </h3>

            </div>


            {/* INACTIVE */}

            <div className="category-stat-card">

              <p>
                Inactive Categories
              </p>

              <h3>

                {
                  categories.filter(
                    (category) =>
                      category.status ===
                      "inactive"
                  ).length
                }

              </h3>

            </div>


          </div>


          {/* TABLE */}

          <div className="category-table-container">


            <table className="category-table">


              <thead>

                <tr>

                  <th>
                    Category Name
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>


                {paginatedCategories.map(
                  (category) => (

                    <tr
                      key={category.id}
                    >


                      {/* CATEGORY NAME */}

                      <td>

                        {
                          category.category_name
                        }

                      </td>


                      {/* DESCRIPTION */}

                      <td
                        className="category-description"
                      >

                        {
                          category.description ||
                          "N/A"
                        }

                      </td>


                      {/* ITEMS */}

                      <td>

                        {
                          category.item_count
                        }

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            category.status ===
                              "active"

                              ? "category-status active"

                              : "category-status inactive"
                          }
                        >

                          <span
                            className="category-status-dot"
                          />

                          {
                            category.status ===
                              "active"

                              ? "Active"

                              : "Inactive"
                          }

                        </span>

                      </td>


                      {/* ACTION */}

                      <td
                        className="category-action-cell"
                      >

                        <button

                          className="category-action-btn"

                          onClick={() =>
                            setOpenAction(

                              openAction ===
                                category.id

                                ? null

                                : category.id

                            )
                          }

                        >

                          ⋮

                        </button>


                        {/* DROPDOWN */}

                        {
                          openAction ===
                          category.id && (

                            <div
                              className="category-action-menu"
                            >


                              {/* VIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleView(
                                    category
                                  )
                                }
                              >

                                <Icon
                                  icon="mdi:eye-outline"
                                />

                                <span>
                                  View
                                </span>

                              </button>


                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    category
                                  )
                                }
                              >

                                <Icon
                                  icon="mdi:pencil-outline"
                                />

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
                                    category
                                  )
                                }
                              >

                                <Icon
                                  icon="mdi:trash-can-outline"
                                />

                                <span>
                                  Delete
                                </span>

                              </button>


                            </div>

                          )
                        }


                      </td>


                    </tr>

                  )
                )}


                {/* NO DATA */}

                {
                  filteredCategories.length ===
                  0 && (

                    <tr>

                      <td
                        colSpan="5"
                        className="category-no-data"
                      >

                        No categories found.

                      </td>

                    </tr>

                  )
                }


              </tbody>


            </table>


            {/* PAGINATION */}

            <div className="category-pagination">

              <button
                className="category-pagination-arrow"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
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
                  className={`category-pagination-number ${currentPage === page
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


              <button
                className="category-pagination-arrow"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
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


export default Categories;