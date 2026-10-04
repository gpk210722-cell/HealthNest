import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedUser =
            localStorage.getItem("healthnest_user");

        if (!savedUser) {
            setLoading(false);
            return;
        }

        const loggedInUser =
            JSON.parse(savedUser);

        const fetchProfile = async () => {
            try {
                const response =
                    await axios.get(
                        `http://127.0.0.1:8000/api/users/${loggedInUser.id}`
                    );

                setUser(response.data);

            } catch (error) {
                console.error(
                    "Profile fetch error:",
                    error
                );

                alert(
                    "Unable to load profile."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

    }, []);


    // =====================================================
    // PROFILE PICTURE UPLOAD
    // =====================================================

    const handleProfilePictureChange =
        async (event) => {

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }


            // Allowed image types
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                alert(
                    "Please select JPG, PNG or WEBP image."
                );

                event.target.value = "";

                return;
            }


            // Maximum 5 MB
            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Profile picture must be less than 5 MB."
                );

                event.target.value = "";

                return;
            }


            try {

                setUploading(true);


                const formData =
                    new FormData();

                formData.append(
                    "file",
                    file
                );


                const response =
                    await axios.post(

                        `http://127.0.0.1:8000/api/users/${user.id}/profile-picture`,

                        formData,

                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }

                    );


                // Update profile picture immediately
                setUser(
                    (previousUser) => ({
                        ...previousUser,

                        profile_picture:
                            response.data
                                .profile_picture,
                    })
                );


                alert(
                    "🎉 Profile picture updated successfully!"
                );


            } catch (error) {

                console.error(
                    "Profile picture upload error:",
                    error
                );


                alert(
                    error.response?.data?.detail ||
                    "Unable to update profile picture."
                );

            } finally {

                setUploading(false);

                event.target.value = "";

            }
        };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "healthnest_token"
        );

        localStorage.removeItem(
            "healthnest_user"
        );

        alert(
            "Logged out successfully."
        );

        navigate("/login");
    };


    // =====================================================
    // PROFILE IMAGE URL
    // =====================================================

    const profileImageUrl =
        user?.profile_picture
            ? `http://127.0.0.1:8000${user.profile_picture}`
            : null;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div style={styles.center}>
                <h2>
                    Loading Profile...
                </h2>
            </div>
        );
    }


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!user) {

        return (
            <div style={styles.center}>

                <h2>
                    Please login to view your profile.
                </h2>

                <Link
                    to="/login"
                    style={styles.loginButton}
                >
                    Login
                </Link>

            </div>
        );
    }


    // =====================================================
    // PROFILE PAGE
    // =====================================================

    return (

        <div style={styles.page}>

            <div style={styles.profileCard}>


                {/* =========================================
                    PROFILE HEADER
                ========================================= */}

                <div style={styles.header}>

                    <div style={styles.avatarWrapper}>

                        {profileImageUrl ? (

                            <img
                                src={profileImageUrl}
                                alt="Profile"
                                style={styles.avatarImage}
                            />

                        ) : (

                            <div style={styles.avatar}>
                                {user.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                        )}


                        {/* Camera Button */}

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            style={styles.cameraButton}
                            disabled={uploading}
                            title="Change Profile Picture"
                        >
                            📷
                        </button>


                        {/* Hidden File Input */}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={
                                handleProfilePictureChange
                            }
                            style={{
                                display: "none",
                            }}
                        />

                    </div>


                    <div>

                        <h1 style={styles.name}>
                            {user.name}
                        </h1>

                        <p style={styles.email}>
                            {user.email}
                        </p>

                        <span style={styles.status}>
                            ● {user.status}
                        </span>


                        {/* Change Picture Button */}

                        <div>

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                style={
                                    styles.changePictureButton
                                }
                                disabled={uploading}
                            >

                                {uploading
                                    ? "⏳ Uploading..."
                                    : "📷 Change Profile Picture"}

                            </button>

                        </div>

                    </div>

                </div>


                {/* =========================================
                    USER INFORMATION
                ========================================= */}

                <div style={styles.infoBox}>

                    <h2>
                        Personal Information
                    </h2>


                    <div style={styles.infoRow}>

                        <strong>
                            User ID
                        </strong>

                        <span>
                            {user.id}
                        </span>

                    </div>


                    <div style={styles.infoRow}>

                        <strong>
                            Name
                        </strong>

                        <span>
                            {user.name}
                        </span>

                    </div>


                    <div style={styles.infoRow}>

                        <strong>
                            Email
                        </strong>

                        <span>
                            {user.email}
                        </span>

                    </div>


                    <div style={styles.infoRow}>

                        <strong>
                            Account Status
                        </strong>

                        <span>
                            {user.status}
                        </span>

                    </div>

                </div>


                {/* =========================================
                    STATISTICS
                ========================================= */}

                <div style={styles.statsSection}>

                    <h2>
                        Your Activity
                    </h2>


                    <div style={styles.statsGrid}>


                        <Link
                            to="/my-blogs"
                            style={styles.statCard}
                        >

                            <div style={styles.icon}>
                                📝
                            </div>

                            <h3>
                                {user.blog_count}
                            </h3>

                            <p>
                                My Blogs
                            </p>

                        </Link>


                        <Link
                            to="/saved-blogs"
                            style={styles.statCard}
                        >

                            <div style={styles.icon}>
                                🔖
                            </div>

                            <h3>
                                {user.saved_count}
                            </h3>

                            <p>
                                Saved Blogs
                            </p>

                        </Link>


                        <div style={styles.statCard}>

                            <div style={styles.icon}>
                                ❤️
                            </div>

                            <h3>
                                {user.likes_count}
                            </h3>

                            <p>
                                Likes Given
                            </p>

                        </div>

                    </div>

                </div>


                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div style={styles.actions}>

                    <Link
                        to="/create-blog"
                        style={styles.createButton}
                    >
                        ✍️ Create Blog
                    </Link>


                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

    page: {
        minHeight:
            "calc(100vh - 70px)",

        background:
            "#f4f8f5",

        padding:
            "50px 20px",
    },


    center: {
        minHeight: "70vh",

        display: "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap: "20px",
    },


    profileCard: {
        maxWidth: "900px",

        margin: "0 auto",

        background:
            "#ffffff",

        borderRadius:
            "20px",

        padding:
            "35px",

        boxShadow:
            "0 10px 35px rgba(0,0,0,0.08)",
    },


    header: {
        display: "flex",

        alignItems:
            "center",

        gap: "25px",

        paddingBottom:
            "30px",

        borderBottom:
            "1px solid #e5e7eb",
    },


    avatarWrapper: {
        position:
            "relative",

        width: "100px",

        height: "100px",

        flexShrink: 0,
    },


    avatar: {
        width: "100px",

        height: "100px",

        borderRadius:
            "50%",

        background:
            "#2e7d32",

        color:
            "#ffffff",

        display: "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "40px",

        fontWeight:
            "bold",

        overflow:
            "hidden",
    },


    avatarImage: {
        width: "100px",

        height: "100px",

        borderRadius:
            "50%",

        objectFit:
            "cover",

        border:
            "4px solid #ffffff",

        boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
    },


    cameraButton: {
        position:
            "absolute",

        right:
            "-2px",

        bottom:
            "-2px",

        width:
            "34px",

        height:
            "34px",

        borderRadius:
            "50%",

        border:
            "3px solid #ffffff",

        background:
            "#2e7d32",

        color:
            "#ffffff",

        cursor:
            "pointer",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "15px",

        padding: 0,
    },


    changePictureButton: {
        marginTop:
            "10px",

        padding:
            "8px 14px",

        border:
            "none",

        borderRadius:
            "8px",

        background:
            "#e8f5e9",

        color:
            "#2e7d32",

        fontWeight:
            "600",

        cursor:
            "pointer",
    },


    name: {
        margin:
            "0 0 6px",

        color:
            "#1f2937",
    },


    email: {
        margin:
            "0 0 10px",

        color:
            "#6b7280",
    },


    status: {
        color:
            "#2e7d32",

        fontWeight:
            "600",
    },


    infoBox: {
        marginTop:
            "30px",

        padding:
            "25px",

        background:
            "#f8faf9",

        borderRadius:
            "15px",
    },


    infoRow: {
        display:
            "flex",

        justifyContent:
            "space-between",

        padding:
            "13px 0",

        borderBottom:
            "1px solid #e5e7eb",

        color:
            "#374151",
    },


    statsSection: {
        marginTop:
            "30px",
    },


    statsGrid: {
        display:
            "grid",

        gridTemplateColumns:
            "repeat(3, 1fr)",

        gap:
            "20px",

        marginTop:
            "20px",
    },


    statCard: {
        textDecoration:
            "none",

        textAlign:
            "center",

        padding:
            "25px 15px",

        background:
            "#f8faf9",

        borderRadius:
            "15px",

        color:
            "#1f2937",

        transition:
            "0.2s",
    },


    icon: {
        fontSize:
            "30px",

        marginBottom:
            "8px",
    },


    actions: {
        display:
            "flex",

        gap:
            "15px",

        marginTop:
            "30px",
    },


    createButton: {
        flex: 1,

        textAlign:
            "center",

        textDecoration:
            "none",

        padding:
            "13px",

        borderRadius:
            "10px",

        background:
            "#2e7d32",

        color:
            "#ffffff",

        fontWeight:
            "600",
    },


    logoutButton: {
        flex: 1,

        border:
            "none",

        padding:
            "13px",

        borderRadius:
            "10px",

        background:
            "#dc2626",

        color:
            "#ffffff",

        fontWeight:
            "600",

        cursor:
            "pointer",
    },


    loginButton: {
        textDecoration:
            "none",

        padding:
            "12px 25px",

        borderRadius:
            "8px",

        background:
            "#2e7d32",

        color:
            "#ffffff",
    },
};


export default Profile;