import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Swal from "sweetalert2"; // SweetAlert2 import kiya
import "../styles/Users.css";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch All Users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUsers(data);
            } else {
                setMessage(data.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage("Something went wrong while fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Update Role
    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire("Success!", "User role updated successfully!", "success");
                fetchUsers();
            } else {
                Swal.fire("Error!", data.message || "Failed to update role", "error");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            Swal.fire("Error!", "Server error while updating role", "error");
        }
    };

    // Delete User with SweetAlert Confirmation
    const handleDeleteUser = async (userId, userEmail) => {
        if (userEmail === "admin@gmail.com") {
            Swal.fire("Access Denied", "Primary Super Admin cannot be deleted!", "warning");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const data = await response.json();

                    if (response.ok) {
                        Swal.fire("Deleted!", "User has been deleted.", "success");
                        fetchUsers();
                    } else {
                        Swal.fire("Error!", data.message || "Failed to delete user", "error");
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                    Swal.fire("Error!", "Server error while deleting user", "error");
                }
            }
        });
    };

    // Open SweetAlert Popup Form for Adding User
    const handleAddUserPopup = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Add New Staff Member",
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Full Name">
                <input id="swal-email" type="email" class="swal2-input" placeholder="Email Address">
                <input id="swal-password" type="password" class="swal2-input" placeholder="Password">
                <select id="swal-role" class="swal2-input" style="width: 80%; padding: 8px;">
                    <option value="data_entry">data_entry</option>
                    <option value="super_admin">super_admin</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Save User",
            confirmButtonColor: "#28a745",
            preConfirm: () => {
                const name = document.getElementById("swal-name").value;
                const email = document.getElementById("swal-email").value;
                const password = document.getElementById("swal-password").value;
                const role = document.getElementById("swal-role").value;

                if (!name || !email || !password) {
                    Swal.showValidationMessage("Please fill in all required fields!");
                }
                return { name, email, password, role };
            }
        });

        if (formValues) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formValues)
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire("Success!", "New user created successfully!", "success");
                    fetchUsers();
                } else {
                    Swal.fire("Error!", data.message || "Failed to create user", "error");
                }
            } catch (error) {
                console.error("Error creating user:", error);
                Swal.fire("Error!", "Server error while creating user", "error");
            }
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />

            <main className="main-content">
                <div className="users-header">
                    <h1>Users Management</h1>
                    <button 
                        className="btn-add" 
                        onClick={handleAddUserPopup}
                    >
                        + Add New User
                    </button>
                </div>

                {message && <p className="error-message">{message}</p>}

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Current Role</th>
                                    <th>Change Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === "super_admin" ? "super-admin" : "data-entry"}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.email === "admin@gmail.com" ? (
                                                <span className="locked-text">🔒 Locked (Primary Admin)</span>
                                            ) : (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="super_admin">super_admin</option>
                                                    <option value="data_entry">data_entry</option>
                                                </select>
                                            )}
                                        </td>
                                        <td>
                                            {user.email !== "admin@gmail.com" && (
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Users;