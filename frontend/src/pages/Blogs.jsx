import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

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

    // =========================
    // FETCH BLOGS
    // =========================

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (category && category !== "All") {
                params.category = category;
            }

            const response = await axios.get(
                "http://127.0.0.1:8000/api/blogs/",
                {
                    params,
                }
            );

            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            alert("Unable to load blogs.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchBlogs();
    }, []);

    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBlogs();
    };

    // =========================
    // CATEGORY FILTER
    // =========================

    const handleCategoryChange = async (selectedCategory) => {
        setCategory(selectedCategory);

        try {
            setLoading(true);

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (
                selectedCategory &&
                selectedCategory !== "All"
            ) {
                params.category = selectedCategory;
            }

            const response = await axios.get(
                "http://127.0.0.1:8000/api/blogs/",
                {
                    params,
                }
            );

            setBlogs(response.data);
        } catch (error) {
            console.error(
                "Category filter error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CLEAR FILTER
    // =========================

    const clearSearch = () => {
        setSearch("");
        setCategory("");

        setTimeout(() => {
            fetchBlogs();
        }, 0);
    };

    return (
        <div className="blogs-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="blogs-header">

                <div className="blogs-header-badge">
                    HEALTH & WELLNESS
                </div>

                <h1>
                    HealthNest Blogs
                </h1>

                <p>
                    Discover useful health and wellness
                    articles written by the HealthNest
                    community.
                </p>

            </div>


            {/* =====================================
                SEARCH
            ===================================== */}

            <form
                onSubmit={handleSearch}
                className="blogs-search-form"
            >

                <input
                    type="text"
                    placeholder="🔎 Search health blogs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="blogs-search-input"
                />

                <button
                    type="submit"
                    className="blogs-search-button"
                >
                    Search
                </button>

            </form>


            {/* =====================================
                CATEGORIES
            ===================================== */}

            <div className="blogs-category-section">

                {categories.map((item) => (

                    <button
                        key={item}
                        onClick={() =>
                            handleCategoryChange(item)
                        }
                        className={`blogs-category-button ${category === item ||
                            (item === "All" &&
                                category === "")
                            ? "active"
                            : ""
                            }`}
                    >
                        {item}
                    </button>

                ))}

            </div>


            {/* =====================================
                RESULT INFO
            ===================================== */}

            <div className="blogs-result-info">

                <div>

                    <h2>

                        {search
                            ? `Search results for "${search}"`
                            : category &&
                                category !== "All"
                                ? `${category} Blogs`
                                : "Latest Blogs"}

                    </h2>

                </div>

                <span>
                    {blogs.length}{" "}
                    {blogs.length === 1
                        ? "blog"
                        : "blogs"}
                </span>

            </div>


            {/* =====================================
                LOADING
            ===================================== */}

            {loading && (

                <div className="blogs-message">

                    <div className="blogs-loader">
                        ⏳
                    </div>

                    <h3>
                        Loading blogs...
                    </h3>

                </div>

            )}


            {/* =====================================
                NO RESULTS
            ===================================== */}

            {!loading &&
                blogs.length === 0 && (

                    <div className="blogs-no-results">

                        <div className="blogs-no-results-icon">
                            🔎
                        </div>

                        <h2>
                            No blogs found
                        </h2>

                        <p>
                            Try another search term
                            or choose a different
                            category.
                        </p>

                        <button
                            onClick={clearSearch}
                            className="blogs-clear-button"
                        >
                            Clear Search
                        </button>

                    </div>

                )}


            {/* =====================================
                BLOG GRID
            ===================================== */}

            {!loading &&
                blogs.length > 0 && (

                    <div className="blogs-grid">

                        {blogs.map((blog) => (

                            <article
                                key={blog.id}
                                className="blogs-card"
                            >

                                {/* CATEGORY */}

                                <div className="blogs-card-top">

                                    <span className="blogs-category-badge">
                                        {blog.category}
                                    </span>

                                </div>


                                {/* TITLE */}

                                <h2 className="blogs-card-title">
                                    {blog.title}
                                </h2>


                                {/* CONTENT */}

                                <p className="blogs-card-content">

                                    {blog.content &&
                                        blog.content.length > 160
                                        ? `${blog.content.substring(
                                            0,
                                            160
                                        )}...`
                                        : blog.content}

                                </p>


                                {/* FOOTER */}

                                <div className="blogs-card-footer">

                                    <span>
                                        👤 User{" "}
                                        {blog.user_id}
                                    </span>

                                    <span>
                                        📅{" "}
                                        {new Date(
                                            blog.created_at
                                        ).toLocaleDateString()}
                                    </span>

                                </div>


                                {/* READ */}

                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="blogs-read-button"
                                >
                                    Read Article →
                                </Link>

                            </article>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default Blogs;