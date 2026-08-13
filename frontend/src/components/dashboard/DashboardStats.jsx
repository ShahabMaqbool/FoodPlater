
import StatCard from "./StatCard";

function DashboardStats({ stats }) {

    return (
        <section className="stats-grid">

            <StatCard
                title="Costumers"
                value={stats.customers}
            />

            <StatCard
                title="New Orders"
                value={stats.newOrders}
            />

            <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
            />

            <StatCard
                title="Completed Orders"
                value={stats.completedOrders}
            />

            <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                fullWidth
            />

        </section>
    );
}

export default DashboardStats;