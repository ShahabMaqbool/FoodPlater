
import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
// Agar aapki koi specific styling file hai toh aap yahan import kar sakte hain

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Backend se saare users fetch karne ka function
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

    // User ka role update karne ka function
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
                alert("User role updated successfully!");
                fetchUsers(); // List ko dobara refresh karein
            } else {
                alert(data.message || "Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Server error while updating role");
        }
    };

    return (
        <div className="admin-container" style={{ display: "flex" }}>
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="main-content" style={{ flex: 1, padding: "30px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
                <h1 style={{ marginBottom: "20px", color: "#333" }}>Users Management</h1>

                {message && <p className="error-message" style={{ color: "red" }}>{message}</p>}

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #eee", color: "#555" }}>
                                    <th style={{ padding: "12px" }}>Name</th>
                                    <th style={{ padding: "12px" }}>Email</th>
                                    <th style={{ padding: "12px" }}>Current Role</th>
                                    <th style={{ padding: "12px" }}>Action (Change Role)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "12px" }}>{user.name}</td>
                                        <td style={{ padding: "12px" }}>{user.email}</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                backgroundColor: user.role === "super_admin" ? "#d4edda" : "#fff3cd",
                                                color: user.role === "super_admin" ? "#155724" : "#856404",
                                                fontWeight: "bold",
                                                fontSize: "12px"
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            {user.email === "admin@gmail.com" ? (
                                                <span style={{ color: "#888", fontStyle: "italic", fontSize: "14px" }}>
                                                    🔒 Locked (Primary Admin)
                                                </span>
                                            ) : (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ccc" }}
                                                >
                                                    <option value="super_admin">super_admin</option>
                                                    <option value="data_entry">data_entry</option>
                                                </select>
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