import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

import "../styles/MenuItems.css";

function MenuItems() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalItems: 0,
    inStockItems: 0,
    outOfStockItems: 0
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Action dropdown state
  const [openActionId, setOpenActionId] = useState(null);



  // Fetch menu items and stats on load
  useEffect(() => {
    fetchMenuItems();
    fetchMenuItemStats();
  }, []);


  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFilter]);



  // Fetch all menu items
  const fetchMenuItems = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/menu-items",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch menu items"
        );
      }

      setMenuItems(data.menuItems);

    } catch (error) {

      console.error("Menu Items Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load menu items.",
        confirmButtonColor: "#2f4a35"
      });

    } finally {

      setLoading(false);

    }
  };



  // Fetch menu item stats
  const fetchMenuItemStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/menu-items/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch stats"
        );
      }

      setStats(data.stats);

    } catch (error) {

      console.error("Menu Item Stats Error:", error);

    }
  };



  // View menu item details
  const handleView = async (item) => {

    setOpenActionId(null);

    // Format full image URL for backend uploads
    const imageUrl = item.image
      ? (item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`)
      : "/burger.png";

    Swal.fire({
      title: item.item_name,
      html: `
        <div style="text-align:left; font-size:14px; line-height:1.8;">

          <div style="text-align:center; margin-bottom:15px;">
            <img
              src="${imageUrl}"
              alt="${item.item_name}"
              style="
                width:100px;
                height:100px;
                object-fit:cover;
                border-radius:12px;
              "
            />
          </div>

          <p>
            <strong>Item ID:</strong>
            #${item.id}
          </p>

          <p>
            <strong>Category:</strong>
            ${item.category}
          </p>

          <p>
            <strong>Price:</strong>
            Rs ${item.price}
          </p>

          <p>
            <strong>Status:</strong>
            ${item.status === "in_stock"
          ? "In Stock"
          : "Out Of Stock"
        }
          </p>

          <p>
            <strong>Date:</strong>
            ${new Date(item.created_at).toLocaleDateString("en-GB")}
          </p>

        </div>
      `,

      confirmButtonText: "Close",
      confirmButtonColor: "#2f4a35",
      width: "430px"
    });
  };



  // Edit menu item with image upload and preview
  const handleEdit = async (item) => {

    setOpenActionId(null);

    const existingImageUrl = item.image
      ? (item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`)
      : "/burger.png";

    const result = await Swal.fire({

      title: "Edit Menu Item",

      html: `

        <input
          id="swal-item-name"
          class="swal2-input"
          placeholder="Item Name"
          value="${item.item_name}"
        />

        <input
          id="swal-category"
          class="swal2-input"
          placeholder="Category"
          value="${item.category}"
        />

        <input
          id="swal-price"
          class="swal2-input"
          type="number"
          placeholder="Price"
          value="${item.price}"
        />

        <select
          id="swal-status"
          class="swal2-select"
          style="
            width:80%;
            margin:10px auto;
            padding:12px;
            border:1px solid #d9d9d9;
            border-radius:5px;
          "
        >

          <option
            value="in_stock"
            ${item.status === "in_stock" ? "selected" : ""}
          >
            In Stock
          </option>

          <option
            value="out_of_stock"
            ${item.status === "out_of_stock" ? "selected" : ""}
          >
            Out Of Stock
          </option>

        </select>

        <div style="margin: 15px auto; width: 80%; text-align: left;">
          <label style="font-size: 13px; color: #555; display: block; margin-bottom: 5px;">Update Image (Optional)</label>
          <input
            id="swal-edit-image"
            type="file"
            accept="image/*"
            style="width: 100%; font-size: 13px;"
          />
        </div>

        <div style="margin-top: 10px; text-align: center;">
          <img
            id="edit-image-preview"
            src="${existingImageUrl}"
            alt="Preview"
            style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin: 0 auto; border: 1px solid #ddd;"
          />
        </div>

      `,

      didOpen: () => {
        const fileInput = document.getElementById("swal-edit-image");
        const previewImg = document.getElementById("edit-image-preview");

        fileInput.addEventListener("change", (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      },

      showCancelButton: true,

      confirmButtonText: "Update",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#2f4a35",

      cancelButtonColor: "#777",

      focusConfirm: false,

      preConfirm: () => {

        const itemName =
          document.getElementById("swal-item-name").value.trim();

        const category =
          document.getElementById("swal-category").value.trim();

        const price =
          document.getElementById("swal-price").value;

        const status =
          document.getElementById("swal-status").value;

        const imageFile = document.getElementById("swal-edit-image").files[0];


        if (!itemName || !category || !price) {

          Swal.showValidationMessage(
            "Please fill all required fields"
          );

          return false;
        }


        return {
          item_name: itemName,
          category: category,
          price: Number(price),
          status: status,
          imageFile: imageFile || null
        };

      }

    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      const token = localStorage.getItem("token");
      const formValues = result.value;

      // FormData use karein taake image file backend tak safely ja sakay
      const formData = new FormData();
      formData.append("item_name", formValues.item_name);
      formData.append("category", formValues.category);
      formData.append("price", formValues.price);
      formData.append("status", formValues.status);

      if (formValues.imageFile) {
        formData.append("image", formValues.imageFile);
      }

      const response = await fetch(
        `http://localhost:5000/api/menu-items/${item.id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message || "Failed to update menu item"
        );

      }


      // Update table state without refresh
      setMenuItems((prevItems) =>
        prevItems.map((menuItem) =>
          menuItem.id === item.id
            ? data.menuItem
            : menuItem
        )
      );


      // Update stats
      fetchMenuItemStats();


      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Menu item updated successfully.",
        confirmButtonColor: "#2f4a35",
        timer: 1800,
        showConfirmButton: false
      });


    } catch (error) {

      console.error("Update Menu Item Error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
        confirmButtonColor: "#2f4a35"
      });

    }

  };


  // Add menu item with image upload and preview
  const handleAdd = async () => {

    const result = await Swal.fire({

      title: "Add New Menu Item",

      html: `
        <input
          id="swal-item-name"
          class="swal2-input"
          placeholder="Item Name"
        />

        <input
          id="swal-category"
          class="swal2-input"
          placeholder="Category"
        />

        <input
          id="swal-price"
          class="swal2-input"
          type="number"
          placeholder="Price"
        />

        <select
          id="swal-status"
          class="swal2-select"
          style="
            width:80%;
            margin:10px auto;
            padding:12px;
            border:1px solid #d9d9d9;
            border-radius:5px;
          "
        >
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out Of Stock</option>
        </select>

        <div style="margin: 15px auto; width: 80%; text-align: left;">
          <label style="font-size: 13px; color: #555; display: block; margin-bottom: 5px;">Product Image</label>
          <input
            id="swal-image"
            type="file"
            accept="image/*"
            style="width: 100%; font-size: 13px;"
          />
        </div>

        <div style="margin-top: 10px; text-align: center;">
          <img
            id="image-preview"
            src=""
            alt="Preview"
            style="display: none; width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin: 0 auto; border: 1px solid #ddd;"
          />
        </div>
      `,

      didOpen: () => {
        const fileInput = document.getElementById("swal-image");
        const previewImg = document.getElementById("image-preview");

        fileInput.addEventListener("change", (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              previewImg.src = e.target.result;
              previewImg.style.display = "block";
            };
            reader.readAsDataURL(file);
          } else {
            previewImg.style.display = "none";
          }
        });
      },

      showCancelButton: true,

      confirmButtonText: "Add Item",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#2f4a35",

      cancelButtonColor: "#777",

      focusConfirm: false,

      preConfirm: () => {

        const itemName = document.getElementById("swal-item-name").value.trim();
        const category = document.getElementById("swal-category").value.trim();
        const price = document.getElementById("swal-price").value;
        const status = document.getElementById("swal-status").value;
        const imageFile = document.getElementById("swal-image").files[0];

        if (!itemName || !category || !price) {
          Swal.showValidationMessage("Please fill all required fields");
          return false;
        }

        // Return plain data object instead of FormData directly
        return {
          item_name: itemName,
          category: category,
          price: price,
          status: status,
          imageFile: imageFile || null
        };

      }

    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      const token = localStorage.getItem("token");
      const formValues = result.value;

      // Construct FormData here safely
      const formData = new FormData();
      formData.append("item_name", formValues.item_name);
      formData.append("category", formValues.category);
      formData.append("price", formValues.price);
      formData.append("status", formValues.status);

      if (formValues.imageFile) {
        formData.append("image", formValues.imageFile);
      }

      const response = await fetch(
        "http://localhost:5000/api/menu-items",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message || "Failed to add menu item"
        );

      }


      // Add new item to table state
      setMenuItems((prevItems) => [data.menuItem, ...prevItems]);


      // Update stats
      fetchMenuItemStats();


      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Menu item added successfully.",
        confirmButtonColor: "#2f4a35",
        timer: 1800,
        showConfirmButton: false
      });


    } catch (error) {

      console.error("Add Menu Item Error:", error);

      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text: error.message,
        confirmButtonColor: "#2f4a35"
      });

    }

  };



  // Delete menu item
  const handleDelete = async (item) => {

    setOpenActionId(null);


    const result = await Swal.fire({

      icon: "warning",

      title: "Are you sure?",

      html: `
        You are about to delete
        <strong>${item.item_name}</strong>.
        <br />
        This action cannot be undone.
      `,

      showCancelButton: true,

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#d33",

      cancelButtonColor: "#777"

    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/menu-items/${item.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message || "Failed to delete menu item"
        );

      }


      // Remove item from table
      setMenuItems((prevItems) =>
        prevItems.filter(
          (menuItem) =>
            menuItem.id !== item.id
        )
      );


      // Update stats
      fetchMenuItemStats();


      // Adjust pagination if needed
      const remainingItems =
        sortedItems.length - 1;

      const newTotalPages =
        Math.ceil(
          remainingItems / itemsPerPage
        );

      if (
        currentPage > newTotalPages &&
        newTotalPages > 0
      ) {
        setCurrentPage(newTotalPages);
      }


      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Menu item deleted successfully.",
        confirmButtonColor: "#2f4a35",
        timer: 1800,
        showConfirmButton: false
      });


    } catch (error) {

      console.error("Delete Menu Item Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
        confirmButtonColor: "#2f4a35"
      });

    }

  };



  // Filter menu items
  const filteredItems = menuItems.filter((item) => {

    const matchesSearch =
      item.item_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.category
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "all" ||
      item.status === statusFilter;


    return matchesSearch && matchesStatus;

  });



  // Date sorting
  const sortedItems = [...filteredItems].sort(
    (a, b) => {

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

    }
  );



  // Pagination calculations
  const totalPages = Math.ceil(
    sortedItems.length / itemsPerPage
  );


  const startIndex =
    (currentPage - 1) * itemsPerPage;


  const currentItems = sortedItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  return (

    <div className="dashboard-layout">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <main className="menu-items-main">

        {/* Header */}
        <DashboardHeader />


        {/* Page Content */}
        <section className="menu-items-content">


          {/* PAGE HEADER */}

          <div className="menu-items-top">

            <h2>Menu Items</h2>


            <div className="menu-items-filters">

              {/* Add menu item button */}
              <button
                className="btn-add"
                onClick={handleAdd}
                style={{
                  backgroundColor: "#2F4A35",
                  color: "#fff",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                + Add Menu Item
              </button>


              {/* SEARCH */}

              <div className="menu-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search Orders"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              {/* STATUS */}

              <div className="menu-filter">

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >

                  <option value="all">
                    Status
                  </option>

                  <option value="in_stock">
                    In Stock
                  </option>

                  <option value="out_of_stock">
                    Out Of Stock
                  </option>

                </select>

                <span>⌄</span>

              </div>


              {/* DATE */}

              <div className="menu-filter">

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


          {/* STATS */}

          <div className="menu-stats">

            <div className="menu-stat-card">

              <p>Total Items</p>

              <h3>
                {stats.totalItems}
              </h3>

            </div>


            <div className="menu-stat-card">

              <p>Instock Items</p>

              <h3>
                {stats.inStockItems}
              </h3>

            </div>


            <div className="menu-stat-card">

              <p>Out Of Stock Items</p>

              <h3>
                {stats.outOfStockItems}
              </h3>

            </div>

          </div>


          {/* TABLE */}

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


                {/* LOADING */}

                {loading && (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "30px"
                      }}
                    >
                      Loading menu items...
                    </td>

                  </tr>

                )}


                {/* MENU ITEMS */}

                {!loading &&
                  currentItems.map((item) => (

                    <tr key={item.id}>


                      {/* ID */}

                      <td>
                        #{item.id}
                      </td>


                      {/* ITEM NAME */}

                      <td>

                        <div className="menu-item-name">

                          <div className="burger-image">


                            <img
                              src={
                                item.image
                                  ? (item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`)
                                  : "/burger.png"
                              }
                              alt={item.item_name}
                            />



                          </div>

                          <span>
                            {item.item_name}
                          </span>

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>
                        {item.category}
                      </td>


                      {/* PRICE */}

                      <td>
                        Rs {item.price}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            item.status === "in_stock"
                              ? "menu-status in-stock"
                              : "menu-status out-stock"
                          }
                        >

                          <span className="status-dot"></span>

                          {item.status === "in_stock"
                            ? "In Stock"
                            : "Out Of Stock"}

                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        {new Date(
                          item.created_at
                        ).toLocaleDateString("en-GB")}

                      </td>


                      {/* ACTION */}

                      <td>

                        <div className="menu-action-wrapper">

                          <button
                            type="button"
                            className="menu-action-btn"
                            onClick={() =>
                              setOpenActionId(
                                openActionId === item.id
                                  ? null
                                  : item.id
                              )
                            }
                          >
                            ⋮
                          </button>


                          {openActionId === item.id && (

                            <div className="menu-action-dropdown">


                              {/* VIEW */}

                              <button
                                type="button"
                                className="action-view"
                                onClick={() =>
                                  handleView(item)
                                }
                              >
                                <span>👁</span>
                                View
                              </button>


                              {/* EDIT */}

                              <button
                                type="button"
                                className="action-edit"
                                onClick={() =>
                                  handleEdit(item)
                                }
                              >
                                <span>✏️</span>
                                Edit
                              </button>


                              {/* DELETE */}
                              {JSON.parse(localStorage.getItem("user"))?.role === "super_admin" && (
                                <button
                                  type="button"
                                  className="action-delete"
                                  onClick={() => handleDelete(item)}
                                >
                                  <span>🗑</span>
                                  Delete
                                </button>
                              )}


                            </div>

                          )}

                        </div>

                      </td>


                    </tr>

                  ))}


                {/* NO DATA */}

                {!loading &&
                  sortedItems.length === 0 && (

                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          padding: "30px"
                        }}
                      >
                        No menu items found.
                      </td>

                    </tr>

                  )}

              </tbody>

            </table>


            {/* PAGINATION */}

            <div className="menu-pagination">


              {/* PREVIOUS */}

              <button
                className="pagination-arrow"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={currentPage === 1}
              >
                ←
              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages
                },
                (_, index) => index + 1

              ).map((page) => (

                <button
                  key={page}
                  className={`pagination-number ${currentPage === page
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


              {/* NEXT */}

              <button
                className="pagination-arrow"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  currentPage === totalPages
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

export default MenuItems;