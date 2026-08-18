import { useState, useEffect } from "react";
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
    // PROFILE
    // ==========================================

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);


    const [profileImage, setProfileImage] =
        useState("/admin-avatar.jpg");

    const [securityInfo, setSecurityInfo] = useState(null);
    const [loginActivities, setLoginActivities] = useState([]);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);


    // ==========================================
    // FETCH PROFILE FROM BACKEND
    // ==========================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token not found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/users/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch profile"
                    );
                }

                // Store complete profile
                setProfile(data.user);

                // Update existing states
                setFullName(data.user.name || "Admin");

                setEmail(
                    data.user.email ||
                    "admin@foodplater.com"
                );

                if (data.user.phone) {
                    setPhone(data.user.phone);
                }

                if (data.user.location) {
                    setLocation(data.user.location);
                }

                // Convert backend date to input date format
                if (data.user.created_at) {

                    setJoinedDate(
                        data.user.created_at.split("T")[0]
                    );

                }

            } catch (error) {

                console.error("Profile Error:", error);

                Swal.fire({
                    icon: "error",
                    title: "Profile Error",
                    text: "Unable to load profile information.",
                    confirmButtonColor: "#2f4a35",
                });

            } finally {

                setLoading(false);

            }
        };


        fetchProfile();

    }, []);

    useEffect(() => {

        const fetchSecurityInfo = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/users/security",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch security information"
                    );
                }

                setSecurityInfo(data.security);

                setTwoFactorEnabled(
                    data.security.two_factor_enabled
                );

            } catch (error) {
                console.error("Security Info Error:", error);
            }
        };

        fetchSecurityInfo();

    }, []);



    // UPDATE PROFILE


    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        // Validation
        if (!fullName || !email || !phone || !location) {

            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill all fields.",
                confirmButtonColor: "#2f4a35",
            });

            return;
        }


        try {

            const token = localStorage.getItem("token");

            if (!token) {

                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again.",
                    confirmButtonColor: "#2f4a35",
                });

                return;
            }


            const response = await fetch(
                "http://localhost:5000/api/users/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        phone: phone,
                        location: location,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update profile"
                );

            }


            // Update frontend profile state
            setProfile(data.user);

            setFullName(data.user.name || "");
            setEmail(data.user.email || "");
            setPhone(data.user.phone || "");
            setLocation(data.user.location || "");


            // Success Alert
            Swal.fire({
                icon: "success",
                title: "Profile Updated!",
                text: "Your profile information has been updated successfully.",
                confirmButtonColor: "#2f4a35",
            });


        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    error.message ||
                    "Something went wrong.",
                confirmButtonColor: "#2f4a35",
            });

        }

    };



    // CHANGE PASSWORD


    const handleChangePassword = async (e) => {

        e.preventDefault();


        // Empty fields validation
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


        // Password length validation
        if (newPassword.length < 6) {

            Swal.fire({
                icon: "warning",
                title: "Weak Password",
                text: "New password must contain at least 6 characters.",
                confirmButtonColor: "#2f4a35",
            });

            return;
        }


        // Password match validation
        if (newPassword !== confirmPassword) {

            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                text: "New password and confirm password do not match.",
                confirmButtonColor: "#2f4a35",
            });

            return;
        }


        try {

            const token = localStorage.getItem("token");


            // Check token
            if (!token) {

                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again.",
                    confirmButtonColor: "#2f4a35",
                });

                return;
            }


            // Loading alert
            Swal.fire({
                title: "Updating Password",
                text: "Please wait...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });



            // BACKEND API

            const response = await fetch(
                "http://localhost:5000/api/users/change-password",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );


            const data = await response.json();


            // Close loading alert
            Swal.close();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to change password"
                );

            }


            // SUCCESS


            Swal.fire({
                icon: "success",
                title: "Password Updated!",
                text: "Your password has been changed successfully.",
                confirmButtonColor: "#2f4a35",
            });


            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");


            // Hide password values
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);


        } catch (error) {

            Swal.close();

            console.error(
                "Change Password Error:",
                error
            );


            Swal.fire({
                icon: "error",
                title: "Password Update Failed",
                text:
                    error.message ||
                    "Something went wrong.",
                confirmButtonColor: "#2f4a35",
            });

        }

    };



    // CHANGE PROFILE IMAGE


    const handleProfileImage = () => {

        document
            .getElementById("profile-image-input")
            .click();

    };


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;


        // Only images allow
        if (!file.type.startsWith("image/")) {

            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please select an image file.",
                confirmButtonColor: "#2f4a35",
            });

            return;

        }


        // Image preview
        const imageUrl =
            URL.createObjectURL(file);

        setProfileImage(imageUrl);


        Swal.fire({
            icon: "success",
            title: "Picture Selected",
            text: "Your profile picture has been selected successfully.",
            confirmButtonColor: "#2f4a35",
        });

    };



    // FORMAT JOINED DATE


    const formatJoinedDate = (date) => {

        if (!date) {
            return "Jan 15, 2024";
        }


        const formattedDate =
            new Date(date);


        if (isNaN(formattedDate.getTime())) {
            return "Jan 15, 2024";
        }


        return formattedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );

    };

    const handleTwoFactorToggle = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again.",
                    confirmButtonColor: "#2f4a35",
                });
                return;
            }

            const newStatus = !twoFactorEnabled;

            const response = await fetch(
                "http://localhost:5000/api/users/two-factor",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        enabled: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update Two-Factor Authentication"
                );
            }

            setTwoFactorEnabled(
                data.two_factor_enabled
            );

            Swal.fire({
                icon: "success",
                title: newStatus
                    ? "2FA Enabled"
                    : "2FA Disabled",
                text: data.message,
                confirmButtonColor: "#2f4a35",
            });

        } catch (error) {

            console.error("2FA Error:", error);

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message,
                confirmButtonColor: "#2f4a35",
            });
        }
    };

    const handleLoginActivity = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: "Please login again.",
                    confirmButtonColor: "#2f4a35",
                });
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/users/login-activity",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch login activity"
                );
            }

            const activities = data.activities || [];

            setLoginActivities(activities);

            Swal.fire({
                title: "Login Activity",
                width: "700px",
                confirmButtonColor: "#2f4a35",

                html: activities.length
                    ? `
                    <div style="text-align:left;">
                        ${activities.map((activity) => `
                            <div style="
                                padding:12px 0;
                                border-bottom:1px solid #eee;
                            ">
                                <strong>
                                    ${new Date(
                        activity.login_time
                    ).toLocaleString()}
                                </strong>

                                <br/>

                                <small>
                                    IP:
                                    ${activity.ip_address ||
                        "Unknown"
                        }
                                </small>
                            </div>
                        `).join("")}
                    </div>
                `
                    : `
                    <p>No login activity found.</p>
                `,
            });

        } catch (error) {

            console.error(
                "Login Activity Error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Login Activity",
                text: error.message,
                confirmButtonColor: "#2f4a35",
            });
        }
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


                        {/* ==========================================
                            PROFILE CARD
                        ========================================== */}

                        <div className="profile-card">

                            {/* PROFILE IMAGE */}
                            <div className="profile-image-wrapper">

                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="profile-image"
                                />

                                <button
                                    type="button"
                                    className="profile-camera-btn"
                                    onClick={handleProfileImage}
                                >
                                    <Icon icon="mdi:camera-outline" />
                                </button>

                                <input
                                    id="profile-image-input"
                                    type="file"
                                    accept="image/*"
                                    style={{
                                        display: "none"
                                    }}
                                    onChange={
                                        handleImageChange
                                    }
                                />

                            </div>


                            {/* NAME */}
                            <h3 className="profile-name">

                                {loading
                                    ? "Loading..."
                                    : fullName}

                            </h3>


                            {/* ROLE */}
                            <span className="profile-role">

                                {profile?.role ||
                                    "Administrator"}

                            </span>


                            {/* DETAILS */}
                            <div className="profile-details">


                                {/* EMAIL */}
                                <div className="profile-detail-item">

                                    <Icon icon="mdi:email-outline" />

                                    <span>
                                        {email}
                                    </span>

                                </div>


                                {/* PHONE */}
                                <div className="profile-detail-item">

                                    <Icon icon="mdi:phone-outline" />

                                    <span>
                                        {phone}
                                    </span>

                                </div>


                                {/* JOINED DATE */}
                                <div className="profile-detail-item">

                                    <Icon icon="mdi:calendar-month-outline" />

                                    <span>
                                        Joined on{" "}
                                        {formatJoinedDate(
                                            joinedDate
                                        )}
                                    </span>

                                </div>


                                {/* LOCATION */}
                                <div className="profile-detail-item">

                                    <Icon icon="mdi:map-marker-outline" />

                                    <span>
                                        {location}
                                    </span>

                                </div>


                            </div>

                        </div>


                        {/* ==========================================
                            PERSONAL INFORMATION
                        ========================================== */}

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
                                        value={
                                            profile?.role ||
                                            "Administrator"
                                        }
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


                        {/* ==========================================
                            ACCOUNT SECURITY
                        ========================================== */}

                        <div className="security-card">

                            <div className="profile-card-heading">

                                <div className="profile-heading-icon green">
                                    <Icon icon="mdi:shield-check-outline" />
                                </div>

                                <div>
                                    <h3>Account Security</h3>
                                    <p>Keep your account secure</p>
                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="security-row">

                                <div>
                                    <h4>Password</h4>
                                    <span>••••••••••</span>
                                </div>

                                <button
                                    type="button"
                                    className="security-change-btn"
                                    onClick={() =>
                                        document
                                            .getElementById("current-password")
                                            ?.focus()
                                    }
                                >
                                    Change
                                </button>

                            </div>


                            {/* TWO FACTOR */}

                            <div className="security-row">

                                <div>
                                    <h4>Two-Factor Authentication</h4>
                                </div>

                                <button
                                    type="button"
                                    className={`security-enabled ${twoFactorEnabled
                                            ? "enabled"
                                            : "disabled"
                                        }`}
                                    onClick={handleTwoFactorToggle}
                                >
                                    {twoFactorEnabled
                                        ? "Enabled"
                                        : "Disabled"}
                                </button>

                            </div>


                            {/* LAST LOGIN */}

                            <div className="security-row">

                                <div>
                                    <h4>Last Login</h4>
                                </div>

                                <span>
                                    {securityInfo?.last_login
                                        ? new Date(
                                            securityInfo.last_login
                                        ).toLocaleString()
                                        : "No login activity"}
                                </span>

                            </div>


                            {/* LOGIN ACTIVITY */}

                            <button
                                type="button"
                                className="login-activity-row"
                                onClick={handleLoginActivity}
                            >

                                <span>
                                    Login Activity
                                </span>

                                <Icon icon="mdi:chevron-right" />

                            </button>

                        </div>


                        {/* ==========================================
                            CHANGE PASSWORD
                        ========================================== */}

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
                                        Update your password regularly to keep your password secure
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