import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        window.innerWidth <= 1100
    );

    const savedUser = localStorage.getItem("healthnest_user");

    const user = savedUser
        ? JSON.parse(savedUser)
        : null;

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1100;

            setIsMobile(mobile);

            if (!mobile) {
                setSidebarOpen(false);
            }
        };

        handleResize();

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(
            "healthnest_token"
        );

        localStorage.removeItem(
            "healthnest_user"
        );

        setSidebarOpen(false);

        alert("Logged out successfully!");

        navigate("/login");
    };

    return (
        <>
            {/* =========================
                SIDEBAR
            ========================= */}

            <aside
                className={`health-sidebar ${sidebarOpen
                    ? "sidebar-open"
                    : ""
                    }`}
                style={
                    isMobile
                        ? {
                            transform: sidebarOpen
                                ? "translateX(0)"
                                : "translateX(-100%)",
                        }
                        : {
                            transform: "translateX(0)",
                        }
                }
            >

                {/* Logo */}

                <Link
                    to="/"
                    className="sidebar-logo"
                    onClick={closeSidebar}
                >
                    <span className="sidebar-logo-icon">
                        🌿
                    </span>

                    <span>
                        HealthNest
                    </span>
                </Link>


                {/* Menu */}

                <div className="sidebar-menu">

                    {/* Home */}

                    <Link
                        to="/"
                        className="sidebar-item"
                        onClick={closeSidebar}
                    >
                        <span>🏠</span>
                        <span>Home</span>
                    </Link>


                    {/* Blogs */}

                    <Link
                        to="/blogs"
                        className="sidebar-item"
                        onClick={closeSidebar}
                    >
                        <span>📖</span>
                        <span>Blogs</span>
                    </Link>


                    {/* Categories */}

                    <Link
                        to="/categories"
                        className="sidebar-item"
                        onClick={closeSidebar}
                    >
                        <span>📂</span>
                        <span>Categories</span>
                    </Link>


                    {/* Health Reels */}

                    <Link
                        to="/reels"
                        className="sidebar-item"
                        onClick={closeSidebar}
                    >
                        <span>🎬</span>
                        <span>Health Reels</span>
                    </Link>


                    {/* Community */}

                    <Link
                        to="/community"
                        className="sidebar-item"
                        onClick={closeSidebar}
                    >
                        <span>👥</span>
                        <span>Community</span>
                    </Link>


                    {/* About */}

                    <Link
                        to="/about"
                        className="sidebar-item"
                        onClick={closeSidebar}
                    >
                        <span>ℹ️</span>
                        <span>About</span>
                    </Link>


                    {/* Logged-in menu */}

                    {user && (
                        <>
                            <div className="sidebar-divider"></div>


                            {/* My Blogs */}

                            <Link
                                to="/my-blogs"
                                className="sidebar-item"
                                onClick={closeSidebar}
                            >
                                <span>📝</span>
                                <span>My Blogs</span>
                            </Link>


                            {/* Saved Blogs */}

                            <Link
                                to="/saved-blogs"
                                className="sidebar-item"
                                onClick={closeSidebar}
                            >
                                <span>🔖</span>
                                <span>Saved Blogs</span>
                            </Link>


                            {/* Health Tracker */}

                            <Link
                                to="/health-tracker"
                                className="sidebar-item"
                                onClick={closeSidebar}
                            >
                                <span>❤️</span>
                                <span>Health</span>
                            </Link>


                            {/* AI Recommendations */}

                            <Link
                                to="/recommendations"
                                className="sidebar-item"
                                onClick={closeSidebar}
                            >
                                <span>🤖</span>
                                <span>
                                    AI Recommendations
                                </span>
                            </Link>


                            {/* Admin */}

                            <Link
                                to="/admin"
                                className="sidebar-item"
                                onClick={closeSidebar}
                            >
                                <span>🛠️</span>
                                <span>Admin</span>
                            </Link>
                        </>
                    )}

                </div>


                {/* Sidebar Logout */}

                <div className="sidebar-bottom">

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="sidebar-logout"
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    )}

                </div>

            </aside>


            {/* =========================
                MOBILE OVERLAY
            ========================= */}

            {isMobile &&
                sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={closeSidebar}
                    ></div>
                )}


            {/* =========================
                TOP NAVBAR
            ========================= */}

            <header className="health-topbar">

                {/* Mobile Menu */}

                {isMobile && (
                    <button
                        className="sidebar-toggle"
                        onClick={() =>
                            setSidebarOpen(
                                !sidebarOpen
                            )
                        }
                        aria-label="Toggle navigation"
                    >
                        {sidebarOpen
                            ? "✕"
                            : "☰"}
                    </button>
                )}


                {/* Title */}

                <div className="topbar-title">
                    Health & Wellness
                </div>


                {/* Actions */}

                <div className="topbar-actions">

                    {/* Create Blog */}

                    {user && (
                        <Link
                            to="/create-blog"
                            className="top-create-btn"
                        >
                            + Create Blog
                        </Link>
                    )}


                    {/* Profile */}

                    <Link
                        to="/profile"
                        className="top-profile-btn"
                    >
                        👤 Profile
                    </Link>


                    {/* Login / Signup */}

                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="top-login-btn"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="top-signup-btn"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="top-logout-btn"
                        >
                            Logout
                        </button>
                    )}

                </div>

            </header>
        </>
    );
}

export default Navbar;