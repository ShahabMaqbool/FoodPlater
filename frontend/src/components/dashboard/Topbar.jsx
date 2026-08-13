
import { Bell } from "lucide-react";

function Topbar() {

    return (
        <header className="topbar">

            <h1>
                Welcome back, Admin!
            </h1>

            <button className="notification-btn">
                <Bell size={20} />

                <span className="notification-dot"></span>
            </button>

        </header>
    );
}

export default Topbar;