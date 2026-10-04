import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            // Save login information
            localStorage.setItem(
                "healthnest_token",
                data.access_token
            );

            localStorage.setItem(
                "healthnest_user",
                JSON.stringify(data.user)
            );

            alert("Login successful!");

            navigate("/profile");
        } catch (error) {
            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f7faf7",
                padding: "50px 20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "18px",
                    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                    }}
                >
                    <div style={{ fontSize: "45px" }}>🌿</div>

                    <h1
                        style={{
                            color: "#17351f",
                            margin: "10px 0",
                        }}
                    >
                        Welcome Back
                    </h1>

                    <p style={{ color: "#66736a" }}>
                        Login to your HealthNest account
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#ffecec",
                            color: "#c62828",
                            padding: "12px 15px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#17351f",
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label
                        style={{
                            display: "block",
                            margin: "18px 0 8px",
                            fontWeight: "600",
                            color: "#17351f",
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            marginTop: "25px",
                            padding: "14px",
                            border: "none",
                            borderRadius: "30px",
                            background: loading ? "#8bb89a" : "#247a3b",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        color: "#66736a",
                    }}
                >
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        style={{
                            color: "#247a3b",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    border: "1px solid #d9e2da",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
};

export default Login;