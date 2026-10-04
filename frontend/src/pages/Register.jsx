import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            alert("Account created successfully! Please login.");

            navigate("/login");
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
                    maxWidth: "480px",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "18px",
                    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div style={{ fontSize: "45px" }}>🌿</div>

                    <h1
                        style={{
                            color: "#17351f",
                            margin: "10px 0",
                        }}
                    >
                        Create Your Account
                    </h1>

                    <p style={{ color: "#66736a" }}>
                        Join the HealthNest community
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
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
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
                        placeholder="Create a password"
                        value={formData.password}
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
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
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
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        color: "#66736a",
                    }}
                >
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "#247a3b",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}
                    >
                        Login
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

export default Register;