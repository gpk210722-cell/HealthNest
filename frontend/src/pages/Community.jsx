import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Community() {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const categories = [
        "All",
        "Fitness",
        "Nutrition",
        "Mental Health",
        "Wellness",
        "Lifestyle",
        "Sleep",
        "Yoga",
    ];

    const fetchBlogs = async (
        searchValue = search,
        categoryValue = category
    ) => {
        try {
            setLoading(true);

            const params = {};

            if (searchValue.trim()) {
                params.search = searchValue.trim();
            }

            if (
                categoryValue &&
                categoryValue !== "All"
            ) {
                params.category = categoryValue;
            }

            const response = await axios.get(
                "http://127.0.0.1:8000/api/blogs/",
                { params }
            );

            setBlogs(response.data);
        } catch (error) {
            console.error(
                "Community blogs error:",
                error
            );
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs("", "All");
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();

        setCategory("All");
        fetchBlogs(search, "All");
    };

    const handleCategory = (selectedCategory) => {
        setCategory(selectedCategory);

        fetchBlogs("", selectedCategory);
    };

    return (
        <main className="community-page">

            {/* HEADER */}
            <section className="community-header">
                <div className="community-icon">
                    👥
                </div>

                <h1>HealthNest Community</h1>

                <p>
                    Discover health stories, tips and ideas
                    shared by the HealthNest community.
                </p>
            </section>

            {/* SEARCH */}
            <form
                onSubmit={handleSearch}
                className="community-search"
            >
                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="🔎 Search community blogs..."
                />

                <button type="submit">
                    Search
                </button>
            </form>

            {/* CATEGORIES */}
            <div className="community-categories">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() =>
                            handleCategory(item)
                        }
                        className={
                            category === item
                                ? "community-category active"
                                : "community-category"
                        }
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* STATS */}
            <div className="community-stats">

                <div className="community-stat-card">
                    <span>📝</span>
                    <strong>{blogs.length}</strong>
                    <p>Visible Blogs</p>
                </div>

                <div className="community-stat-card">
                    <span>🌿</span>
                    <strong>Health</strong>
                    <p>Community Focus</p>
                </div>

                <div className="community-stat-card">
                    <span>🤝</span>
                    <strong>Share</strong>
                    <p>Learn Together</p>
                </div>

            </div>

            {/* SECTION TITLE */}
            <div className="community-section-header">
                <div>
                    <h2>
                        {category === "All"
                            ? "Latest Community Blogs"
                            : `${category} Community Blogs`}
                    </h2>

                    <p>
                        {blogs.length} blog
                        {blogs.length !== 1
                            ? "s"
                            : ""}{" "}
                        found
                    </p>
                </div>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="community-message">
                    <h3>Loading community...</h3>
                </div>
            )}

            {/* NO RESULTS */}
            {!loading && blogs.length === 0 && (
                <div className="community-no-results">

                    <div className="community-no-icon">
                        🔎
                    </div>

                    <h2>
                        No community blogs found
                    </h2>

                    <p>
                        Try another search term or
                        category.
                    </p>

                    <button
                        onClick={() => {
                            setSearch("");
                            setCategory("All");
                            fetchBlogs("", "All");
                        }}
                    >
                        Show All Blogs
                    </button>

                </div>
            )}

            {/* BLOG FEED */}
            {!loading && blogs.length > 0 && (
                <div className="community-feed">

                    {blogs.map((blog) => (
                        <article
                            key={blog.id}
                            className="community-blog-card"
                        >

                            {/* BLOG HEADER */}
                            <div className="community-blog-header">

                                <div className="community-avatar">
                                    👤
                                </div>

                                <div className="community-user-info">
                                    <strong>
                                        HealthNest User
                                    </strong>

                                    <p>
                                        User {blog.user_id}
                                        {" • "}
                                        {new Date(
                                            blog.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                            </div>

                            {/* CATEGORY */}
                            <span className="community-badge">
                                {blog.category}
                            </span>

                            {/* TITLE */}
                            <h2>
                                {blog.title}
                            </h2>

                            {/* CONTENT */}
                            <p className="community-content">
                                {blog.content.length > 250
                                    ? `${blog.content.substring(
                                        0,
                                        250
                                    )}...`
                                    : blog.content}
                            </p>

                            {/* ACTIONS */}
                            <div className="community-actions">

                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="community-read-button"
                                >
                                    📖 Read Article
                                </Link>

                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="community-action-button"
                                >
                                    ❤️ Like
                                </Link>

                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="community-action-button"
                                >
                                    💬 Comment
                                </Link>

                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="community-action-button"
                                >
                                    🔖 Save
                                </Link>

                            </div>

                        </article>
                    ))}

                </div>
            )}

        </main>
    );
}

export default Community;