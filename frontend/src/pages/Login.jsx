import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");

        if (!email || !password) {
            setMessage("Please enter email and password");
            return;
        }

        try {

            setLoading(true);

            const data = await loginUser(email, password);
            console.log("Login Successfull,data recived",data);

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user information 
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login catch error:", error);
            setMessage(error.message);

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-container">

                <h1>Admin Dashboard</h1>

                <p className="subtitle">
                    Welcome! Please Login to Continue
                </p>

                <form onSubmit={handleLogin}>

                    <label>
                        Username/Email
                    </label>

                    <input
                        type="text"
                        placeholder="Enter username or email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Login;