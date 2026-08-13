
const API_URL = "http://localhost:5000/api/dashboard";

export const getDashboardStats = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/stats`,
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
        throw new Error(
            data.message || "Failed to fetch dashboard stats"
        );
    }

    return data;
};