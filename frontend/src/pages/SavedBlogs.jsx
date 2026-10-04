import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SavedBlogs() {
    const navigate = useNavigate();

    const [savedBlogs, setSavedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    const getCurrentUser = () => {
        const savedUser =
            localStorage.getItem("healthnest_user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    };

    const fetchSavedBlogs = async () => {
        const user = getCurrentUser();

        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get(
                `http://127.0.0.1:8000/api/bookmarks/user/${user.id}`
            );

            setSavedBlogs(response.data);
        } catch (error) {
            console.error(
                "Error fetching saved blogs:",
                error
            );

            alert("Unable to load saved blogs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedBlogs();
    }, []);

    const handleRemove = async (blogId) => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        const confirmRemove = window.confirm(
            "Remove this blog from Saved Blogs?"
        );

        if (!confirmRemove) {
            return;
        }

        try {
            setRemovingId(blogId);

            await axios.delete(
                `http://127.0.0.1:8000/api/bookmarks/${blogId}`,
                {
                    params: {
                        user_id: user.id,
                    },
                }
            );

            setSavedBlogs((currentBlogs) =>
                currentBlogs.filter(
                    (blog) => blog.blog_id !== blogId
                )
            );

            alert("Blog removed from Saved Blogs.");
        } catch (error) {
            console.error(
                "Error removing saved blog:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to remove saved blog."
            );
        } finally {
            setRemovingId(null);
        }
    };

    const handleView = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    if (loading) {
        return (
            <main className="saved-blogs-page">
                <div className="saved-blogs-loading">
                    Loading saved blogs...
                </div>
            </main>
        );
    }

    const user = getCurrentUser();

    if (!user) {
        return (
            <main className="saved-blogs-page saved-login-page">

                <div className="saved-login-card">

                    <div className="saved-login-icon">
                        🔐
                    </div>

                    <h2>
                        Login Required
                    </h2>

                    <p>
                        Please login to view your saved blogs.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>

            </main>
        );
    }

    return (
        <main className="saved-blogs-page">

            <div className="saved-blogs-container">

                {/* HEADER */}
                <header className="saved-blogs-header">

                    <div>
                        <h1>
                            Saved Blogs
                        </h1>

                        <p>
                            Your saved health and wellness
                            articles
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/blogs")
                        }
                        className="saved-explore-btn"
                    >
                        Explore Blogs
                    </button>

                </header>

                {/* EMPTY */}
                {savedBlogs.length === 0 ? (

                    <section className="saved-empty">

                        <div className="saved-empty-icon">
                            🔖
                        </div>

                        <h2>
                            No Saved Blogs
                        </h2>

                        <p>
                            You haven't saved any blogs yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/blogs")
                            }
                        >
                            Find Blogs
                        </button>

                    </section>

                ) : (

                    <>
                        {/* COUNT */}
                        <p className="saved-count">
                            {savedBlogs.length}{" "}
                            {savedBlogs.length === 1
                                ? "saved article"
                                : "saved articles"}
                        </p>

                        {/* BLOG CARDS */}
                        <section className="saved-blog-grid">

                            {savedBlogs.map((blog) => (
                                <article
                                    key={blog.bookmark_id}
                                    className="saved-blog-card"
                                >

                                    <span className="saved-blog-category">
                                        {blog.category}
                                    </span>

                                    <h2>
                                        {blog.title}
                                    </h2>

                                    <p className="saved-blog-content">
                                        {blog.content.length >
                                            180
                                            ? `${blog.content.substring(
                                                0,
                                                180
                                            )}...`
                                            : blog.content}
                                    </p>

                                    <p className="saved-blog-date">
                                        📅{" "}
                                        {new Date(
                                            blog.created_at
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>

                                    <div className="saved-blog-buttons">

                                        <button
                                            onClick={() =>
                                                handleView(
                                                    blog.blog_id
                                                )
                                            }
                                            className="saved-view-btn"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleRemove(
                                                    blog.blog_id
                                                )
                                            }
                                            disabled={
                                                removingId ===
                                                blog.blog_id
                                            }
                                            className="saved-remove-btn"
                                        >
                                            {removingId ===
                                                blog.blog_id
                                                ? "Removing..."
                                                : "Remove"}
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </section>
                    </>
                )}

            </div>

        </main>
    );
}

export default SavedBlogs;