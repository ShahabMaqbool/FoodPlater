import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatCard";

import "../styles/Dashboard.css";

function Dashboard() {

    const [stats, setStats] = useState({
        customers: 0,
        newOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalOrders: 0
    });

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/dashboard/stats",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setStats(data.stats);
                } else {
                    console.error(data.message);
                }

            } catch (error) {

                console.error(
                    "Failed to fetch dashboard stats:",
                    error
                );

            }
        };

        fetchDashboardStats();

    }, []);


    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <Sidebar />


            {/* Main Content */}
            <main className="dashboard-main">

                <DashboardHeader />


                {/* Statistics */}
                <section className="stats-grid">

                    <StatsCard
                        title="Customers"
                        value={stats.customers}
                    />

                    <StatsCard
                        title="New Orders"
                        value={stats.newOrders}
                    />

                    <StatsCard
                        title="Pending Orders"
                        value={stats.pendingOrders}
                    />

                    <StatsCard
                        title="Completed Orders"
                        value={stats.completedOrders}
                    />

                    <StatsCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        fullWidth
                    />

                </section>

            </main>

        </div>
    );
}

export default Dashboard;