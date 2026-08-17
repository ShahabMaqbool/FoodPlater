import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import "../styles/Profile.css";

function Profile() {

    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    const [fullName, setFullName] = useState("Admin");
    const [email, setEmail] = useState("admin@foodplater.com");
    const [phone, setPhone] = useState("+92 300 1234567");
    const [location, setLocation] = useState("Islamabad, Pakistan");
    const [joinedDate, setJoinedDate] = useState("2024-01-15");

    // ==========================================
    // PASSWORD
    // ==========================================

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleUpdateProfile = (e) => {
        e.preventDefault();

        if (!fullName || !email || !phone || !location) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill all required fields.",
                confirmButtonColor: "#2f4a35",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile information has been updated successfully.",
            confirmButtonColor: "#2f4a35",
        });
    };


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleChangePassword = (e) => {
        e.preventDefault();

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill all password fields.",
                confirmButtonColor: "#2f4a35",
            });
            return;
        }

        if (newPassword.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Weak Password",
                text: "New password must contain at least 6 characters.",
                confirmButtonColor: "#2f4a35",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                text: "New password and confirm password do not match.",
                confirmButtonColor: "#2f4a35",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Password Updated",
            text: "Your password has been changed successfully.",
            confirmButtonColor: "#2f4a35",
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };


    // ==========================================
    // CHANGE PROFILE IMAGE
    // ==========================================

    const handleProfileImage = () => {
        Swal.fire({
            title: "Profile Picture",
            text: "Profile picture upload will be connected with backend later.",
            icon: "info",
            confirmButtonColor: "#2f4a35",
        });
    };


    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <main className="profile-main">

                <DashboardHeader />

                <section className="profile-content">

                    {/* PAGE HEADING */}
                    <div className="profile-page-heading">
                        <h2>My Profile</h2>
                        <p>
                            Manage your account information and
                            security settings.
                        </p>
                    </div>

                    {/* TOP ROW */}
                    <div className="profile-top-row">

                        {/* PROFILE CARD */}
                        <div className="profile-card">

                            {/* PROFILE IMAGE */}
                            <div className="profile-image-wrapper">
                                <img
                                    src="./public/admin-avatar.jpg"
                                    alt="Profile"
                                    className="profile-image"
                                />

                                <button
                                    className="profile-camera-btn"
                                    onClick={handleProfileImage}
                                >
                                    <Icon icon="mdi:camera-outline" />
                                </button>
                            </div>

                            {/* NAME */}
                            <h3 className="profile-name">
                                {fullName}
                            </h3>

                            {/* ROLE */}
                            <span className="profile-role">
                                Administrator
                            </span>

                            {/* DETAILS */}
                            <div className="profile-details">

                                <div className="profile-detail-item">
                                    <Icon icon="mdi:email-outline" />
                                    <span>
                                        {email}
                                    </span>
                                </div>

                                <div className="profile-detail-item">
                                    <Icon icon="mdi:phone-outline" />
                                    <span>
                                        {phone}
                                    </span>
                                </div>

                                <div className="profile-detail-item">
                                    <Icon icon="mdi:calendar-month-outline" />
                                    <span>
                                        Joined on Jan 15, 2024
                                    </span>
                                </div>

                                <div className="profile-detail-item">
                                    <Icon icon="mdi:map-marker-outline" />
                                    <span>
                                        {location}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* PERSONAL INFORMATION */}
                        <div className="profile-information-card">

                            <div className="profile-card-heading">
                                <div className="profile-heading-icon">
                                    <Icon icon="mdi:account-outline" />
                                </div>
                                <div>
                                    <h3>
                                        Personal Information
                                    </h3>
                                    <p>
                                        Update your personal details
                                    </p>
                                </div>
                            </div>

                            <form
                                className="profile-form"
                                onSubmit={handleUpdateProfile}
                            >

                                {/* FULL NAME */}
                                <div className="profile-input-group">
                                    <label>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* EMAIL */}
                                <div className="profile-input-group">
                                    <label>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* PHONE */}
                                <div className="profile-input-group">
                                    <label>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* ROLE */}
                                <div className="profile-input-group">
                                    <label>
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        value="Administrator"
                                        disabled
                                    />
                                </div>

                                {/* LOCATION */}
                                <div className="profile-input-group">
                                    <label>
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* JOINED DATE */}
                                <div className="profile-input-group">
                                    <label>
                                        Joined Date
                                    </label>
                                    <div className="profile-date-input">
                                        <input
                                            type="date"
                                            value={joinedDate}
                                            onChange={(e) =>
                                                setJoinedDate(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Icon icon="mdi:calendar-month-outline" />
                                    </div>
                                </div>

                                {/* UPDATE BUTTON */}
                                <button
                                    type="submit"
                                    className="profile-update-btn"
                                >
                                    Update Profile
                                </button>

                            </form>

                        </div>

                    </div>

                    {/* BOTTOM ROW */}
                    <div className="profile-bottom-row">

                        {/* ACCOUNT SECURITY */}
                        <div className="security-card">

                            <div className="profile-card-heading">
                                <div className="profile-heading-icon green">
                                    <Icon icon="mdi:shield-check-outline" />
                                </div>
                                <div>
                                    <h3>
                                        Account Security
                                    </h3>
                                    <p>
                                        Keep your account secure
                                    </p>
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="security-row">
                                <div>
                                    <h4>
                                        Password
                                    </h4>
                                    <span>
                                        ••••••••••
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="security-change-btn"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "current-password"
                                            )
                                            ?.focus()
                                    }
                                >
                                    Change
                                </button>
                            </div>

                            {/* TWO FACTOR */}
                            <div className="security-row">
                                <div>
                                    <h4>
                                        Two-Factor Authentication
                                    </h4>
                                </div>
                                <span className="security-enabled">
                                    Enabled
                                </span>
                            </div>

                            {/* LAST LOGIN */}
                            <div className="security-row">
                                <div>
                                    <h4>
                                        Last Login
                                    </h4>
                                </div>
                                <span>
                                    May 26, 2025 10:30 AM
                                </span>
                            </div>

                            {/* LOGIN ACTIVITY */}
                            <button
                                type="button"
                                className="login-activity-row"
                                onClick={() =>
                                    Swal.fire({
                                        title: "Login Activity",
                                        text: "Login activity will be connected with backend later.",
                                        icon: "info",
                                        confirmButtonColor:
                                            "#2f4a35",
                                    })
                                }
                            >
                                <span>
                                    Login Activity
                                </span>
                                <Icon icon="mdi:chevron-right" />
                            </button>

                        </div>

                        {/* CHANGE PASSWORD */}
                        <div className="change-password-card">

                            <div className="profile-card-heading">
                                <div className="profile-heading-icon green">
                                    <Icon icon="mdi:lock-outline" />
                                </div>
                                <div>
                                    <h3>
                                        Change Password
                                    </h3>
                                    <p>
                                        Update your password regularly to keep your account secure
                                    </p>
                                </div>
                            </div>

                            <form
                                className="password-form"
                                onSubmit={handleChangePassword}
                            >

                                {/* CURRENT PASSWORD */}
                                <div className="password-input-group">
                                    <label>
                                        Current Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="current-password"
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter current password"
                                            value={
                                                currentPassword
                                            }
                                            onChange={(e) =>
                                                setCurrentPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword
                                                )
                                            }
                                        >
                                            <Icon
                                                icon={
                                                    showCurrentPassword
                                                        ? "mdi:eye-off-outline"
                                                        : "mdi:eye-outline"
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* NEW PASSWORD */}
                                <div className="password-input-group">
                                    <label>
                                        New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter new password"
                                            value={
                                                newPassword
                                            }
                                            onChange={(e) =>
                                                setNewPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >
                                            <Icon
                                                icon={
                                                    showNewPassword
                                                        ? "mdi:eye-off-outline"
                                                        : "mdi:eye-outline"
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="password-input-group">
                                    <label>
                                        Confirm New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm new password"
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            <Icon
                                                icon={
                                                    showConfirmPassword
                                                        ? "mdi:eye-off-outline"
                                                        : "mdi:eye-outline"
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* UPDATE PASSWORD */}
                                <button
                                    type="submit"
                                    className="password-update-btn"
                                >
                                    Update Password
                                </button>

                            </form>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Profile;