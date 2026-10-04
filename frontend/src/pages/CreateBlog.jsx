import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateBlog() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const savedUser = localStorage.getItem("healthnest_user");

        if (!savedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(savedUser);

        if (!title.trim() || !category || !content.trim()) {
            alert("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `http://127.0.0.1:8000/api/blogs/?user_id=${user.id}`,
                {
                    title,
                    category,
                    content,
                }
            );

            console.log("Blog created:", response.data);

            alert("Blog published successfully! 🎉");

            setTitle("");
            setCategory("");
            setContent("");

            navigate("/my-blogs");

        } catch (error) {
            console.error("Create blog error:", error);

            if (error.response) {
                alert(
                    error.response.data?.detail ||
                    "Failed to create blog."
                );
            } else {
                alert("Backend se connection nahi ho pa raha.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "calc(100vh - 70px)",
                background: "#f5faf7",
                padding: "50px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        color: "#176b3a",
                        fontSize: "36px",
                        marginBottom: "10px",
                    }}
                >
                    Create a Blog
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "35px",
                        fontSize: "16px",
                    }}
                >
                    Share your health and wellness knowledge with the HealthNest
                    community.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div style={{ marginBottom: "22px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                                color: "#222",
                            }}
                        >
                            Blog Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "13px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                fontSize: "16px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: "22px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                                color: "#222",
                            }}
                        >
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "13px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                fontSize: "16px",
                                background: "#fff",
                                boxSizing: "border-box",
                            }}
                        >
                            <option value="">Select Category</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Nutrition">Nutrition</option>
                            <option value="Mental Wellness">
                                Mental Wellness
                            </option>
                            <option value="Sleep">Sleep</option>
                            <option value="Study & Health">
                                Study & Health
                            </option>
                            <option value="Healthy Habits">
                                Healthy Habits
                            </option>
                        </select>
                    </div>

                    {/* Content */}
                    <div style={{ marginBottom: "25px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                                color: "#222",
                            }}
                        >
                            Blog Content
                        </label>

                        <textarea
                            rows="12"
                            placeholder="Write your blog content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "13px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                fontSize: "16px",
                                resize: "vertical",
                                fontFamily: "inherit",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            border: "none",
                            borderRadius: "8px",
                            background: loading ? "#999" : "#176b3a",
                            color: "#fff",
                            fontSize: "17px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateBlog;