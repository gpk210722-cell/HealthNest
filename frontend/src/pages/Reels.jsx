import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Reels() {

    const [reels, setReels] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showUpload, setShowUpload] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);


    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [category, setCategory] =
        useState("Fitness");

    const [video, setVideo] =
        useState(null);


    const [likedReels, setLikedReels] =
        useState([]);

    const [savedReels, setSavedReels] =
        useState([]);


    const videoRefs =
        useRef({});


    // =====================================================
    // CURRENT USER
    // =====================================================

    const savedUser =
        localStorage.getItem(
            "healthnest_user"
        );


    const user = savedUser
        ? JSON.parse(savedUser)
        : null;


    // =====================================================
    // LOAD REELS
    // =====================================================

    const loadReels = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await axios.get(
                    "http://127.0.0.1:8000/api/reels/"
                );


            setReels(
                response.data.reels || []
            );

        } catch (err) {

            console.error(
                "Reels loading error:",
                err
            );


            setError(
                err.response?.data?.detail ||
                "Unable to load reels."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadReels();

    }, []);


    // =====================================================
    // AUTO PLAY / PAUSE
    // =====================================================

    useEffect(() => {

        if (!reels.length) {
            return;
        }


        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach(
                        (entry) => {

                            const videoElement =
                                entry.target;


                            if (
                                entry.isIntersecting
                            ) {

                                videoElement
                                    .play()
                                    .catch(
                                        () => { }
                                    );

                            } else {

                                videoElement.pause();

                            }

                        }
                    );

                },

                {
                    threshold: 0.65,
                }

            );


        Object.values(
            videoRefs.current
        ).forEach(
            (videoElement) => {

                if (videoElement) {

                    observer.observe(
                        videoElement
                    );

                }

            }
        );


        return () => {

            observer.disconnect();

        };

    }, [reels]);


    // =====================================================
    // UPLOAD REEL
    // =====================================================

    const handleUpload = async (e) => {

        e.preventDefault();


        if (!user) {

            alert(
                "Please login first."
            );

            return;
        }


        if (!title.trim()) {

            alert(
                "Please enter reel title."
            );

            return;
        }


        if (!video) {

            alert(
                "Please select a video."
            );

            return;
        }


        if (
            video.size >
            100 * 1024 * 1024
        ) {

            alert(
                "Video size must be less than 100 MB."
            );

            return;
        }


        try {

            setUploading(true);


            const formData =
                new FormData();


            formData.append(
                "user_id",
                user.id
            );


            formData.append(
                "title",
                title
            );


            formData.append(
                "description",
                description
            );


            formData.append(
                "category",
                category
            );


            formData.append(
                "video",
                video
            );


            await axios.post(

                "http://127.0.0.1:8000/api/reels/",

                formData,

                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }

            );


            alert(
                "🎉 Reel uploaded successfully!"
            );


            setTitle("");

            setDescription("");

            setCategory("Fitness");

            setVideo(null);


            const fileInput =
                document.getElementById(
                    "reel-video-input"
                );


            if (fileInput) {

                fileInput.value = "";

            }


            setShowUpload(false);


            await loadReels();


        } catch (err) {

            console.error(
                "Reel upload error:",
                err
            );


            alert(
                err.response?.data?.detail ||
                "Failed to upload reel."
            );

        } finally {

            setUploading(false);

        }

    };


    // =====================================================
    // DELETE REEL
    // =====================================================

    const handleDelete =
        async (reelId) => {

            if (!user) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this reel?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await axios.delete(

                    `http://127.0.0.1:8000/api/reels/${reelId}?user_id=${user.id}`

                );


                setReels(
                    (previous) =>
                        previous.filter(
                            (reel) =>
                                reel.id !==
                                reelId
                        )
                );


                alert(
                    "Reel deleted successfully."
                );


            } catch (err) {

                console.error(
                    "Delete error:",
                    err
                );


                alert(
                    err.response?.data?.detail ||
                    "Unable to delete reel."
                );

            }

        };


    // =====================================================
    // LIKE
    // =====================================================

    const toggleLike =
        (reelId) => {

            setLikedReels(
                (previous) => {

                    if (
                        previous.includes(
                            reelId
                        )
                    ) {

                        return previous.filter(
                            (id) =>
                                id !==
                                reelId
                        );

                    }


                    return [
                        ...previous,
                        reelId,
                    ];

                }
            );

        };


    // =====================================================
    // SAVE
    // =====================================================

    const toggleSave =
        (reelId) => {

            setSavedReels(
                (previous) => {

                    if (
                        previous.includes(
                            reelId
                        )
                    ) {

                        return previous.filter(
                            (id) =>
                                id !==
                                reelId
                        );

                    }


                    return [
                        ...previous,
                        reelId,
                    ];

                }
            );

        };


    // =====================================================
    // SHARE
    // =====================================================

    const handleShare =
        async (reel) => {

            const shareUrl =
                `${window.location.origin}/reels#reel-${reel.id}`;


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            reel.title,

                        text:
                            reel.description ||
                            "Check out this HealthNest reel!",

                        url:
                            shareUrl,

                    });

                } else {

                    await navigator.clipboard.writeText(
                        shareUrl
                    );


                    alert(
                        "Reel link copied!"
                    );

                }

            } catch (err) {

                console.log(
                    "Share cancelled."
                );

            }

        };


    // =====================================================
    // COMMENT
    // =====================================================

    const handleComment = () => {

        alert(
            "Comment feature can be connected to the backend next."
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="instagram-reels-loading">

                <div className="reels-spinner"></div>

                <h2>
                    Loading Health Reels...
                </h2>

                <p>
                    Preparing your wellness videos.
                </p>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="instagram-reels-page">


            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="instagram-reels-topbar">

                <div>

                    <h1>
                        🎬 Health Reels
                    </h1>

                    <p>
                        Scroll to explore health &
                        wellness videos
                    </p>

                </div>


                {user && (

                    <button
                        className="reels-create-button"
                        onClick={() =>
                            setShowUpload(
                                !showUpload
                            )
                        }
                    >

                        {showUpload
                            ? "✕ Close"
                            : "＋ Create Reel"}

                    </button>

                )}

            </div>


            {/* =================================================
                UPLOAD PANEL
            ================================================= */}

            {showUpload && user && (

                <div className="reels-upload-panel">


                    <div className="reels-upload-heading">

                        <div className="reels-upload-icon">
                            🎬
                        </div>


                        <div>

                            <h2>
                                Create Health Reel
                            </h2>

                            <p>
                                Share a useful
                                health & wellness
                                video.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={
                            handleUpload
                        }
                        className="reels-upload-form"
                    >


                        {/* TITLE */}

                        <div className="reels-input-group">

                            <label>
                                Reel Title *
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. 5 Minute Morning Workout"
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="reels-input-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Tell viewers about your reel..."
                                rows="4"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="reels-input-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Fitness">
                                    Fitness
                                </option>

                                <option value="Workout">
                                    Workout
                                </option>

                                <option value="Yoga">
                                    Yoga
                                </option>

                                <option value="Nutrition">
                                    Nutrition
                                </option>

                                <option value="Meditation">
                                    Meditation
                                </option>

                                <option value="Mental Health">
                                    Mental Health
                                </option>

                                <option value="Wellness">
                                    Wellness
                                </option>

                                <option value="General">
                                    General
                                </option>

                            </select>

                        </div>


                        {/* VIDEO */}

                        <div className="reels-input-group">

                            <label>
                                Video *
                            </label>

                            <input
                                id="reel-video-input"
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setVideo(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                                required
                            />

                            <small>
                                MP4, MOV, AVI,
                                MKV, WEBM •
                                Maximum 100 MB
                            </small>

                        </div>


                        {/* SELECTED FILE */}

                        {video && (

                            <div className="reels-selected-file">

                                🎥

                                <span>
                                    {video.name}
                                </span>

                            </div>

                        )}


                        {/* UPLOAD BUTTON */}

                        <button
                            type="submit"
                            className="reels-upload-submit"
                            disabled={uploading}
                        >

                            {uploading
                                ? "⏳ Uploading..."
                                : "🚀 Upload Reel"}

                        </button>

                    </form>

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="reels-error-message">

                    <div>
                        ⚠️ {error}
                    </div>

                    <button
                        onClick={
                            loadReels
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                NO REELS
            ================================================= */}

            {!error &&
                reels.length === 0 && (

                    <div className="no-reels">

                        <div className="no-reels-icon">
                            🎬
                        </div>

                        <h2>
                            No Reels Yet
                        </h2>

                        <p>
                            Be the first to
                            upload a health
                            & wellness reel.
                        </p>


                        {user && (

                            <button
                                onClick={() =>
                                    setShowUpload(
                                        true
                                    )
                                }
                            >
                                ＋ Upload First Reel
                            </button>

                        )}

                    </div>

                )}


            {/* =================================================
                REELS FEED
            ================================================= */}

            {reels.length > 0 && (

                <div className="reels-scroll-container">

                    {reels.map(
                        (reel) => {

                            const videoUrl =
                                reel.video_url?.startsWith(
                                    "http"
                                )
                                    ? reel.video_url
                                    : `http://127.0.0.1:8000${reel.video_url}`;


                            const isOwner =
                                user &&
                                Number(
                                    user.id
                                ) ===
                                Number(
                                    reel.user_id
                                );


                            const isLiked =
                                likedReels.includes(
                                    reel.id
                                );


                            const isSaved =
                                savedReels.includes(
                                    reel.id
                                );


                            return (

                                <section
                                    className="instagram-reel"
                                    id={`reel-${reel.id}`}
                                    key={reel.id}
                                >


                                    {/* VIDEO */}

                                    <video
                                        ref={(element) => {

                                            if (element) {

                                                videoRefs.current[
                                                    reel.id
                                                ] = element;

                                            }

                                        }}
                                        className="instagram-reel-video"
                                        src={videoUrl}
                                        controls
                                        playsInline
                                        loop
                                        preload="metadata"
                                    />


                                    <div className="reel-gradient"></div>


                                    {/* CATEGORY */}

                                    <div className="reel-category-badge">

                                        #
                                        {reel.category ||
                                            "Health"}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="reel-actions">


                                        {/* LIKE */}

                                        <button
                                            onClick={() =>
                                                toggleLike(
                                                    reel.id
                                                )
                                            }
                                            className={
                                                isLiked
                                                    ? "reel-action-active"
                                                    : ""
                                            }
                                        >

                                            {isLiked
                                                ? "❤️"
                                                : "🤍"}

                                            <span>
                                                {isLiked
                                                    ? "Liked"
                                                    : "Like"}
                                            </span>

                                        </button>


                                        {/* COMMENT */}

                                        <button
                                            onClick={
                                                handleComment
                                            }
                                        >

                                            💬

                                            <span>
                                                Comment
                                            </span>

                                        </button>


                                        {/* SAVE */}

                                        <button
                                            onClick={() =>
                                                toggleSave(
                                                    reel.id
                                                )
                                            }
                                            className={
                                                isSaved
                                                    ? "reel-action-active"
                                                    : ""
                                            }
                                        >

                                            {isSaved
                                                ? "🔖"
                                                : "📑"}

                                            <span>
                                                {isSaved
                                                    ? "Saved"
                                                    : "Save"}
                                            </span>

                                        </button>


                                        {/* SHARE */}

                                        <button
                                            onClick={() =>
                                                handleShare(
                                                    reel
                                                )
                                            }
                                        >

                                            ↗️

                                            <span>
                                                Share
                                            </span>

                                        </button>


                                        {/* DELETE */}

                                        {isOwner && (

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        reel.id
                                                    )
                                                }
                                                className="reel-delete-action"
                                            >

                                                🗑️

                                                <span>
                                                    Delete
                                                </span>

                                            </button>

                                        )}

                                    </div>


                                    {/* =================================================
                                        BOTTOM CONTENT
                                    ================================================= */}

                                    <div className="reel-bottom-content">


                                        {/* CREATOR */}

                                        <div className="reel-creator">

                                            <div className="creator-avatar">
                                                👤
                                            </div>


                                            <strong>

                                                {reel.user_name ||
                                                    "HealthNest User"}

                                            </strong>


                                            <button>
                                                Follow
                                            </button>

                                        </div>


                                        {/* TITLE */}

                                        <h2>
                                            {reel.title}
                                        </h2>


                                        {/* DESCRIPTION */}

                                        {reel.description && (

                                            <p>
                                                {
                                                    reel.description
                                                }
                                            </p>

                                        )}


                                        {/* AUDIO */}

                                        <div className="reel-music">

                                            🎵 HealthNest •
                                            Original audio

                                        </div>

                                    </div>

                                </section>

                            );

                        }
                    )}

                </div>

            )}


            {/* =================================================
                FLOATING UPLOAD BUTTON
            ================================================= */}

            {user && !showUpload && (

                <button
                    className="reels-floating-upload"
                    onClick={() =>
                        setShowUpload(
                            true
                        )
                    }
                    title="Upload Reel"
                    aria-label="Upload Reel"
                >
                    ＋
                </button>

            )}

        </div>

    );
}

export default Reels;