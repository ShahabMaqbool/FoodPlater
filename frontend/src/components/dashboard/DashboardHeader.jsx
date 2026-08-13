
import NotificationIcon from "./icons/NotificationIcon";
import { useEffect, useState } from "react";

function DashboardHeader() {

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch orders"
                    );
                }

                const latestOrders = data.orders
                    .filter(
                        (order) =>
                            order.status === "new" ||
                            order.status === "pending"
                    )
                    .slice(0, 3);

                setNotifications(latestOrders);

            } catch (error) {
                console.error("Notification error:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <header className="dashboard-header">

            <h1>
                Welcome back, Admin!
            </h1>



            <div className="notification-wrapper">

                <button
                    className="notification-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <NotificationIcon />
                </button>

                {showNotifications && (
                    <div className="notification-dropdown">

                        <div className="notification-header">
                            <h3>Notifications</h3>
                            <span>{notifications.length} New</span>
                        </div>

                        {notifications.map((order) => (
                            <div className="notification-item" key={order.id}>

                                <div
                                    className={`notification-icon ${order.status}`}
                                >
                                    {order.status === "pending" ? "⏳" : "🛒"}
                                </div>

                                <div>
                                    <strong>
                                        {order.status === "pending"
                                            ? "Order Pending"
                                            : "New Order Received"}
                                    </strong>

                                    <p>
                                        Order #{order.id} — {order.customer}
                                    </p>

                                    <small>
                                        {new Date(order.created_at).toLocaleString()}
                                    </small>
                                </div>

                            </div>
                        ))}

                        {notifications.length === 0 && (
                            <div className="notification-empty">
                                No new notifications
                            </div>
                        )}



                        <button className="view-all-notifications">
                            View All Notifications
                        </button>

                    </div>
                )}

            </div>

        </header>
    );
}

export default DashboardHeader;