import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyBlogs() {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const [editingBlog, setEditingBlog] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editContent, setEditContent] = useState("");
    const [updating, setUpdating] = useState(false);

    const categories = [
        "Fitness",
        "Nutrition",
        "Mental Wellness",
        "Sleep",
        "Study & Health",
        "Healthy Habits",
    ];

    const fetchMyBlogs = async () => {
        try {
            setLoading(true);

            const savedUser =
                localStorage.getItem("healthnest_user");

            if (!savedUser) {
                alert("Please login first!");
                navigate("/login");
                return;
            }

            const user = JSON.parse(savedUser);

            const response = await axios.get(
                `http://127.0.0.1:8000/api/blogs/user/${user.id}`
            );

            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to load your blogs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setEditTitle(blog.title);
        setEditCategory(blog.category);
        setEditContent(blog.content);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCancelEdit = () => {
        setEditingBlog(null);
        setEditTitle("");
        setEditCategory("");
        setEditContent("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const savedUser =
            localStorage.getItem("healthnest_user");

        if (!savedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(savedUser);

        if (
            !editTitle.trim() ||
            !editCategory ||
            !editContent.trim()
        ) {
            alert("Please fill all fields.");
            return;
        }

        try {
            setUpdating(true);

            const response = await axios.put(
                `http://127.0.0.1:8000/api/blogs/${editingBlog.id}?user_id=${user.id}`,
                {
                    title: editTitle,
                    category: editCategory,
                    content: editContent,
                }
            );

            setBlogs((currentBlogs) =>
                currentBlogs.map((blog) =>
                    blog.id === editingBlog.id
                        ? response.data
                        : blog
                )
            );

            alert("Blog updated successfully! ✏️");

            handleCancelEdit();
        } catch (error) {
            console.error("Update blog error:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to update blog."
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (blogId) => {
        const savedUser =
            localStorage.getItem("healthnest_user");

        if (!savedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(savedUser);

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingId(blogId);

            await axios.delete(
                `http://127.0.0.1:8000/api/blogs/${blogId}?user_id=${user.id}`
            );

            alert("Blog deleted successfully! 🗑️");

            setBlogs((currentBlogs) =>
                currentBlogs.filter(
                    (blog) => blog.id !== blogId
                )
            );
        } catch (error) {
            console.error("Delete blog error:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to delete blog."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const viewBlog = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <main className="my-blogs-page">
                <div className="my-blogs-loading">
                    Loading your blogs...
                </div>
            </main>
        );
    }

    return (
        <main className="my-blogs-page">

            <div className="my-blogs-container">

                {/* EDIT FORM */}
                {editingBlog && (
                    <section className="my-blogs-edit-card">

                        <h2>Edit Blog</h2>

                        <form onSubmit={handleUpdate}>

                            <div className="my-blogs-form-group">
                                <label>
                                    Blog Title
                                </label>

                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="my-blogs-form-group">
                                <label>
                                    Category
                                </label>

                                <select
                                    value={editCategory}
                                    onChange={(e) =>
                                        setEditCategory(
                                            e.target.value
                                        )
                                    }
                                >
                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="my-blogs-form-group">
                                <label>
                                    Blog Content
                                </label>

                                <textarea
                                    rows="10"
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="my-blogs-edit-buttons">

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="my-blogs-save-btn"
                                >
                                    {updating
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelEdit
                                    }
                                    className="my-blogs-cancel-btn"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </section>
                )}

                {/* HEADER */}
                <header className="my-blogs-header">

                    <div>
                        <h1>Your Articles</h1>

                        <p>
                            {blogs.length} published{" "}
                            {blogs.length === 1
                                ? "article"
                                : "articles"}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/create-blog")
                        }
                        className="my-blogs-create-btn"
                    >
                        + Create Blog
                    </button>

                </header>

                {/* NO BLOGS */}
                {blogs.length === 0 ? (
                    <section className="my-blogs-empty">

                        <div className="my-blogs-empty-icon">
                            📝
                        </div>

                        <h2>No blogs yet</h2>

                        <p>
                            Start sharing your health and
                            wellness knowledge.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/create-blog")
                            }
                        >
                            Create Your First Blog
                        </button>

                    </section>
                ) : (

                    /* BLOG CARDS */
                    <section className="my-blogs-grid">

                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="my-blog-card"
                            >

                                <span className="my-blog-category">
                                    {blog.category}
                                </span>

                                <h2>
                                    {blog.title}
                                </h2>

                                <p className="my-blog-content">
                                    {blog.content.length > 180
                                        ? blog.content.substring(
                                            0,
                                            180
                                        ) + "..."
                                        : blog.content}
                                </p>

                                <div className="my-blog-published">

                                    <span>
                                        ● Published
                                    </span>

                                    <span>
                                        {formatDate(
                                            blog.created_at
                                        )}
                                    </span>

                                </div>

                                <div className="my-blog-buttons">

                                    <button
                                        onClick={() =>
                                            viewBlog(
                                                blog.id
                                            )
                                        }
                                        className="my-blog-view"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleEdit(blog)
                                        }
                                        className="my-blog-edit"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                blog.id
                                            )
                                        }
                                        disabled={
                                            deletingId ===
                                            blog.id
                                        }
                                        className="my-blog-delete"
                                    >
                                        {deletingId ===
                                            blog.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </article>
                        ))}

                    </section>
                )}

            </div>

        </main>
    );
}

export default MyBlogs;