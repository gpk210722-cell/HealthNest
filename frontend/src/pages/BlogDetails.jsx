import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    // Like states
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // Bookmark states
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // Comment states
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [deletingCommentId, setDeletingCommentId] =
        useState(null);

    // --------------------------------
    // GET CURRENT USER
    // --------------------------------
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

    // --------------------------------
    // GET BLOG
    // --------------------------------
    const fetchBlog = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `http://127.0.0.1:8000/api/blogs/${id}`
            );

            setBlog(response.data);
        } catch (error) {
            console.error("Error fetching blog:", error);

            if (error.response?.status === 404) {
                alert("Blog not found.");
            } else {
                alert("Unable to load blog.");
            }

            navigate("/blogs");
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // GET LIKE COUNT
    // --------------------------------
    const fetchLikeCount = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/likes/${id}`
            );

            setLikeCount(response.data.like_count);
        } catch (error) {
            console.error(
                "Error fetching like count:",
                error
            );
        }
    };

    // --------------------------------
    // CHECK LIKE STATUS
    // --------------------------------
    const checkUserLike = async () => {
        const user = getCurrentUser();

        if (!user) {
            return;
        }

        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/likes/${id}/user/${user.id}`
            );

            setIsLiked(response.data.liked);
        } catch (error) {
            console.error(
                "Error checking like status:",
                error
            );
        }
    };

    // --------------------------------
    // CHECK BOOKMARK STATUS
    // --------------------------------
    const checkBookmarkStatus = async () => {
        const user = getCurrentUser();

        if (!user) {
            return;
        }

        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/bookmarks/${id}/user/${user.id}`
            );

            setIsSaved(response.data.saved);
        } catch (error) {
            console.error(
                "Error checking bookmark status:",
                error
            );
        }
    };

    // --------------------------------
    // GET COMMENTS
    // --------------------------------
    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/comments/${id}`
            );

            setComments(response.data);
        } catch (error) {
            console.error(
                "Error fetching comments:",
                error
            );
        }
    };

    // --------------------------------
    // LOAD PAGE
    // --------------------------------
    useEffect(() => {
        fetchBlog();
        fetchLikeCount();
        checkUserLike();
        checkBookmarkStatus();
        fetchComments();
    }, [id]);

    // --------------------------------
    // LIKE / UNLIKE
    // --------------------------------
    const handleLike = async () => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login to like this blog.");
            navigate("/login");
            return;
        }

        try {
            setLikeLoading(true);

            if (isLiked) {
                const response = await axios.delete(
                    `http://127.0.0.1:8000/api/likes/${id}`,
                    {
                        params: {
                            user_id: user.id,
                        },
                    }
                );

                setLikeCount(response.data.like_count);
                setIsLiked(false);
            } else {
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/likes/${id}`,
                    null,
                    {
                        params: {
                            user_id: user.id,
                        },
                    }
                );

                setLikeCount(response.data.like_count);
                setIsLiked(true);
            }
        } catch (error) {
            console.error(
                "Like/unlike error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to update like."
            );
        } finally {
            setLikeLoading(false);
        }
    };

    // --------------------------------
    // SAVE / UNSAVE BLOG
    // --------------------------------
    const handleBookmark = async () => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login to save this blog.");
            navigate("/login");
            return;
        }

        try {
            setSaveLoading(true);

            if (isSaved) {
                await axios.delete(
                    `http://127.0.0.1:8000/api/bookmarks/${id}`,
                    {
                        params: {
                            user_id: user.id,
                        },
                    }
                );

                setIsSaved(false);

                alert("Blog removed from Saved Blogs.");
            } else {
                await axios.post(
                    `http://127.0.0.1:8000/api/bookmarks/${id}`,
                    null,
                    {
                        params: {
                            user_id: user.id,
                        },
                    }
                );

                setIsSaved(true);

                alert("Blog saved successfully! 🔖");
            }
        } catch (error) {
            console.error(
                "Bookmark error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to update saved blog."
            );
        } finally {
            setSaveLoading(false);
        }
    };

    // --------------------------------
    // ADD COMMENT
    // --------------------------------
    const handleAddComment = async (e) => {
        e.preventDefault();

        const user = getCurrentUser();

        if (!user) {
            alert("Please login to comment.");
            navigate("/login");
            return;
        }

        if (!commentText.trim()) {
            alert("Please write a comment.");
            return;
        }

        try {
            setCommentLoading(true);

            await axios.post(
                `http://127.0.0.1:8000/api/comments/${id}`,
                null,
                {
                    params: {
                        user_id: user.id,
                        content: commentText.trim(),
                    },
                }
            );

            setCommentText("");

            await fetchComments();

            alert("Comment added successfully! 💬");
        } catch (error) {
            console.error(
                "Add comment error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to add comment."
            );
        } finally {
            setCommentLoading(false);
        }
    };

    // --------------------------------
    // DELETE COMMENT
    // --------------------------------
    const handleDeleteComment = async (
        commentId
    ) => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingCommentId(commentId);

            await axios.delete(
                `http://127.0.0.1:8000/api/comments/${commentId}`,
                {
                    params: {
                        user_id: user.id,
                    },
                }
            );

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment.id !== commentId
                )
            );

            alert("Comment deleted successfully!");
        } catch (error) {
            console.error(
                "Delete comment error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to delete comment."
            );
        } finally {
            setDeletingCommentId(null);
        }
    };

    // --------------------------------
    // FORMAT DATE
    // --------------------------------
    const formatDate = (dateString) => {
        return new Date(
            dateString
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // --------------------------------
    // LOADING
    // --------------------------------
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#238b45",
                    fontSize: "20px",
                }}
            >
                Loading blog...
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    return (
        <div
            style={{
                minHeight: "calc(100vh - 80px)",
                background: "#f5faf7",
                padding: "50px 20px",
            }}
        >
            <article
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "45px",
                    boxShadow:
                        "0 8px 30px rgba(0,0,0,0.07)",
                }}
            >
                {/* Back */}
                <button
                    onClick={() => navigate("/blogs")}
                    style={{
                        border: "none",
                        background: "transparent",
                        color: "#238b45",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginBottom: "30px",
                    }}
                >
                    ← Back to Blogs
                </button>

                {/* Category */}
                <span
                    style={{
                        display: "inline-block",
                        background: "#eaf7ed",
                        color: "#17833b",
                        padding: "9px 16px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "20px",
                    }}
                >
                    {blog.category}
                </span>

                {/* Title */}
                <h1
                    style={{
                        color: "#123b2a",
                        fontSize: "42px",
                        lineHeight: "1.2",
                        margin: "0 0 20px",
                    }}
                >
                    {blog.title}
                </h1>

                {/* Meta */}
                <div
                    style={{
                        borderBottom:
                            "1px solid #e5e5e5",
                        paddingBottom: "22px",
                        marginBottom: "30px",
                        display: "flex",
                        gap: "25px",
                        flexWrap: "wrap",
                        color: "#777",
                    }}
                >
                    <span>
                        👤 User ID: {blog.user_id}
                    </span>

                    <span>
                        📅 {formatDate(blog.created_at)}
                    </span>

                    <span
                        style={{
                            color: "#16813a",
                            fontWeight: "600",
                        }}
                    >
                        ● Published
                    </span>
                </div>

                {/* Content */}
                <div
                    style={{
                        color: "#444",
                        fontSize: "18px",
                        lineHeight: "1.9",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {blog.content}
                </div>

                {/* Like + Save */}
                <div
                    style={{
                        marginTop: "35px",
                        paddingTop: "25px",
                        borderTop:
                            "1px solid #e5e5e5",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        disabled={likeLoading}
                        style={{
                            padding: "12px 22px",
                            borderRadius: "25px",
                            border: isLiked
                                ? "1px solid #238b45"
                                : "1px solid #ddd",
                            background: isLiked
                                ? "#eaf7ed"
                                : "#ffffff",
                            color: isLiked
                                ? "#238b45"
                                : "#555",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: likeLoading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {isLiked
                            ? "❤️ Liked"
                            : "♡ Like"}
                    </button>

                    <span
                        style={{
                            color: "#555",
                            fontSize: "16px",
                        }}
                    >
                        {likeCount}{" "}
                        {likeCount === 1
                            ? "Like"
                            : "Likes"}
                    </span>

                    {/* Save */}
                    <button
                        onClick={handleBookmark}
                        disabled={saveLoading}
                        style={{
                            padding: "12px 22px",
                            borderRadius: "25px",
                            border: isSaved
                                ? "1px solid #238b45"
                                : "1px solid #ddd",
                            background: isSaved
                                ? "#eaf7ed"
                                : "#ffffff",
                            color: isSaved
                                ? "#238b45"
                                : "#555",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: saveLoading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {isSaved
                            ? "🔖 Saved"
                            : "🔖 Save Blog"}
                    </button>
                </div>

                {/* Comments */}
                <section
                    style={{
                        marginTop: "40px",
                        paddingTop: "30px",
                        borderTop:
                            "1px solid #e5e5e5",
                    }}
                >
                    <h2
                        style={{
                            color: "#123b2a",
                            fontSize: "28px",
                            marginBottom: "25px",
                        }}
                    >
                        Comments ({comments.length})
                    </h2>

                    {/* Add Comment */}
                    <form
                        onSubmit={handleAddComment}
                        style={{
                            marginBottom: "35px",
                        }}
                    >
                        <textarea
                            value={commentText}
                            onChange={(e) =>
                                setCommentText(
                                    e.target.value
                                )
                            }
                            placeholder="Write your comment..."
                            rows="4"
                            style={{
                                width: "100%",
                                padding: "14px",
                                border:
                                    "1px solid #ccc",
                                borderRadius: "10px",
                                fontSize: "16px",
                                resize: "vertical",
                                fontFamily:
                                    "inherit",
                                boxSizing: "border-box",
                            }}
                        />

                        <button
                            type="submit"
                            disabled={commentLoading}
                            style={{
                                marginTop: "12px",
                                background:
                                    commentLoading
                                        ? "#999"
                                        : "#238b45",
                                color: "#fff",
                                border: "none",
                                padding:
                                    "12px 22px",
                                borderRadius: "25px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor:
                                    commentLoading
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {commentLoading
                                ? "Posting..."
                                : "Post Comment"}
                        </button>
                    </form>

                    {/* Comments List */}
                    {comments.length === 0 ? (
                        <div
                            style={{
                                background: "#f7faf8",
                                padding: "25px",
                                borderRadius: "12px",
                                textAlign: "center",
                                color: "#777",
                            }}
                        >
                            No comments yet. Be the first
                            to comment! 💬
                        </div>
                    ) : (
                        <div>
                            {comments.map((comment) => {
                                const user =
                                    getCurrentUser();

                                return (
                                    <div
                                        key={comment.id}
                                        style={{
                                            background:
                                                "#f7faf8",
                                            borderRadius:
                                                "12px",
                                            padding:
                                                "18px",
                                            marginBottom:
                                                "15px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                gap: "15px",
                                                marginBottom:
                                                    "10px",
                                            }}
                                        >
                                            <strong
                                                style={{
                                                    color:
                                                        "#123b2a",
                                                }}
                                            >
                                                👤 User{" "}
                                                {comment.user_id}
                                            </strong>

                                            <span
                                                style={{
                                                    color:
                                                        "#888",
                                                    fontSize:
                                                        "13px",
                                                }}
                                            >
                                                {formatDate(
                                                    comment.created_at
                                                )}
                                            </span>
                                        </div>

                                        <p
                                            style={{
                                                margin:
                                                    "0 0 12px",
                                                color:
                                                    "#555",
                                                lineHeight:
                                                    "1.6",
                                            }}
                                        >
                                            {comment.content}
                                        </p>

                                        {user &&
                                            user.id ===
                                            comment.user_id && (
                                                <button
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingCommentId ===
                                                        comment.id
                                                    }
                                                    style={{
                                                        border:
                                                            "none",
                                                        background:
                                                            "transparent",
                                                        color:
                                                            "#d33",
                                                        cursor:
                                                            "pointer",
                                                        padding: 0,
                                                        fontSize:
                                                            "14px",
                                                    }}
                                                >
                                                    {deletingCommentId ===
                                                        comment.id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Bottom */}
                <div
                    style={{
                        marginTop: "40px",
                        paddingTop: "25px",
                        borderTop:
                            "1px solid #e5e5e5",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            color: "#777",
                            marginBottom: "15px",
                        }}
                    >
                        Thanks for reading HealthNest 💚
                    </p>

                    <button
                        onClick={() =>
                            navigate("/blogs")
                        }
                        style={{
                            background: "#238b45",
                            color: "#fff",
                            border: "none",
                            padding: "12px 25px",
                            borderRadius: "25px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Explore More Blogs
                    </button>
                </div>
            </article>
        </div>
    );
}

export default BlogDetails;