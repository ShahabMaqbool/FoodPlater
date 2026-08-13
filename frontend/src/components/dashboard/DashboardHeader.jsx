
import { Icon } from "@iconify/react";
import NotificationIcon from "./icons/NotificationIcon";

function DashboardHeader() {

    return (
        <header className="dashboard-header">

            <h1>
                Welcome back, Admin!
            </h1>

            <button className="notification-btn">

                <NotificationIcon />

            </button>

        </header>
    );
}

export default DashboardHeader;