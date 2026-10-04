import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Categories() {
    const [blogs, setBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            name: "Fitness",
            icon: "💪",
            description: "Exercise, workouts and physical fitness",
        },
        {
            name: "Nutrition",
            icon: "🥗",
            description: "Healthy food, diet and nutrition",
        },
        {
            name: "Mental Health",
            icon: "🧠",
            description: "Stress management and mental wellness",
        },
        {
            name: "Wellness",
            icon: "🌿",
            description: "Healthy habits and overall wellbeing",
        },
        {
            name: "Lifestyle",
            icon: "✨",
            description: "Healthy daily routines and lifestyle",
        },
        {
            name: "Sleep",
            icon: "😴",
            description: "Better sleep and healthy sleep habits",
        },
        {
            name: "Yoga",
            icon: "🧘",
            description: "Yoga, stretching and relaxation",
        },
    ];

    const fetchBlogs = async (category = "All") => {
        try {
            setLoading(true);

            const params = {};

            if (category !== "All") {
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
            console.error(
                "Error fetching category blogs:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs("All");
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchBlogs(category);
    };

    return (
        <div className="categories-page">

            {/* ================= HEADER ================= */}

            <div className="categories-header">

                <div className="categories-badge">
                    🌿 HEALTH & WELLNESS
                </div>

                <h1>
                    Explore Health Categories
                </h1>

                <p>
                    Find health and wellness blogs based on
                    your interests.
                </p>

            </div>


            {/* ================= CATEGORY CARDS ================= */}

            <div className="categories-category-grid">

                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() =>
                            handleCategoryClick(
                                category.name
                            )
                        }
                        className={`categories-category-card ${selectedCategory ===
                            category.name
                            ? "categories-category-card-active"
                            : ""
                            }`}
                    >

                        <div className="categories-icon">
                            {category.icon}
                        </div>

                        <h2>
                            {category.name}
                        </h2>

                        <p>
                            {category.description}
                        </p>

                    </button>
                ))}

            </div>


            {/* ================= ALL BUTTON ================= */}

            <div className="categories-all-button-container">

                <button
                    onClick={() =>
                        handleCategoryClick("All")
                    }
                    className={`categories-all-button ${selectedCategory === "All"
                        ? "categories-all-button-active"
                        : ""
                        }`}
                >
                    🌐 Show All Blogs
                </button>

            </div>


            {/* ================= RESULTS HEADER ================= */}

            <div className="categories-results-header">

                <h2>
                    {selectedCategory === "All"
                        ? "All Health Blogs"
                        : `${selectedCategory} Blogs`}
                </h2>

                <span>
                    {blogs.length} blog
                    {blogs.length !== 1 ? "s" : ""}
                </span>

            </div>


            {/* ================= LOADING ================= */}

            {loading && (
                <div className="categories-message">
                    <div className="categories-loading-icon">
                        🌿
                    </div>

                    <h3>
                        Loading blogs...
                    </h3>

                    <p>
                        Please wait while we fetch the
                        latest health articles.
                    </p>
                </div>
            )}


            {/* ================= NO RESULTS ================= */}

            {!loading && blogs.length === 0 && (
                <div className="categories-no-results">

                    <div className="categories-no-icon">
                        📭
                    </div>

                    <h2>
                        No blogs in this category
                    </h2>

                    <p>
                        There are currently no blogs available
                        for this category.
                    </p>

                    <button
                        onClick={() =>
                            handleCategoryClick("All")
                        }
                        className="categories-clear-button"
                    >
                        View All Blogs
                    </button>

                </div>
            )}


            {/* ================= BLOG GRID ================= */}

            {!loading && blogs.length > 0 && (
                <div className="categories-blog-grid">

                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="categories-blog-card"
                        >

                            <span className="categories-blog-badge">
                                {blog.category}
                            </span>

                            <h2>
                                {blog.title}
                            </h2>

                            <p className="categories-blog-content">
                                {blog.content.length > 180
                                    ? `${blog.content.substring(
                                        0,
                                        180
                                    )}...`
                                    : blog.content}
                            </p>

                            <div className="categories-blog-meta">

                                <span>
                                    👤 User {blog.user_id}
                                </span>

                                <span>
                                    📅{" "}
                                    {new Date(
                                        blog.created_at
                                    ).toLocaleDateString()}
                                </span>

                            </div>

                            <Link
                                to={`/blog/${blog.id}`}
                                className="categories-read-button"
                            >
                                Read Article →
                            </Link>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Categories;