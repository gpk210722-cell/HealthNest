import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://127.0.0.1:8000/api/admin/dashboard"
            );

            console.log("Admin Dashboard:", response.data);

            setDashboard(response.data);
        } catch (err) {
            console.error("Admin error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to connect to Admin Dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="admin-page admin-state-page">
                <div className="admin-loading">
                    <div className="admin-loading-icon">🛠️</div>
                    <h2>Loading Admin Dashboard...</h2>
                    <p>Please wait...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-page admin-state-page">
                <div className="admin-error-card">
                    <div className="admin-error-icon">⚠️</div>

                    <h1>Admin Dashboard Error</h1>

                    <p>{error}</p>

                    <button
                        onClick={loadDashboard}
                        className="admin-retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="admin-page admin-state-page">
                <div className="admin-empty-card">
                    <div>📊</div>
                    <h2>No dashboard data found.</h2>
                </div>
            </main>
        );
    }

    const stats = dashboard.statistics || {};
    const blogs = dashboard.recent_blogs || [];

    return (
        <main className="admin-page">
            <div className="admin-container">

                {/* Header */}
                <header className="admin-header">
                    <div>
                        <h1>🛠️ Admin Dashboard</h1>

                        <p>
                            HealthNest platform overview and activity.
                        </p>
                    </div>
                </header>

                {/* Statistics */}
                <section className="admin-stats-grid">

                    <div className="admin-card">
                        <div className="admin-icon">👥</div>

                        <div className="admin-number">
                            {stats.total_users ?? 0}
                        </div>

                        <div className="admin-label">
                            Total Users
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-icon">📝</div>

                        <div className="admin-number">
                            {stats.total_blogs ?? 0}
                        </div>

                        <div className="admin-label">
                            Total Blogs
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-icon">❤️</div>

                        <div className="admin-number">
                            {stats.total_likes ?? 0}
                        </div>

                        <div className="admin-label">
                            Total Likes
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-icon">💬</div>

                        <div className="admin-number">
                            {stats.total_comments ?? 0}
                        </div>

                        <div className="admin-label">
                            Total Comments
                        </div>
                    </div>

                </section>

                {/* Recent Blogs */}
                <section className="admin-blogs-card">

                    <div className="admin-section-header">
                        <h2>📝 Recent Blogs</h2>

                        <span className="admin-blog-count">
                            {blogs.length} blogs
                        </span>
                    </div>

                    {blogs.length === 0 ? (
                        <div className="admin-no-blogs">
                            <div>📝</div>

                            <p>No blogs available.</p>
                        </div>
                    ) : (
                        <div className="admin-blog-list">

                            {blogs.map((blog) => (
                                <article
                                    key={blog.id}
                                    className="admin-blog-item"
                                >
                                    <div className="admin-blog-content">

                                        <h3>
                                            {blog.title}
                                        </h3>

                                        <div className="admin-blog-category">
                                            {blog.category}
                                        </div>

                                        <div className="admin-blog-meta">
                                            Blog ID: {blog.id}
                                            <span>•</span>
                                            User ID: {blog.user_id}
                                        </div>

                                    </div>
                                </article>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}

export default Admin;