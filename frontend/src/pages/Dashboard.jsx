function Dashboard() {
    return (
        <div
            style={{
                minHeight: "calc(100vh - 80px)",
                padding: "60px 8%",
                background: "#f7faf7",
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                <p
                    style={{
                        color: "#247a3b",
                        fontWeight: "700",
                        letterSpacing: "1px",
                    }}
                >
                    HEALTHNEST
                </p>

                <h1
                    style={{
                        color: "#17351f",
                        margin: "10px 0",
                    }}
                >
                    Dashboard
                </h1>

                <p
                    style={{
                        color: "#66736a",
                        fontSize: "17px",
                    }}
                >
                    Welcome to your HealthNest dashboard.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginTop: "40px",
                    }}
                >
                    <div style={cardStyle}>
                        <div style={{ fontSize: "35px" }}>📝</div>
                        <h3>My Blogs</h3>
                        <p>Manage the health blogs you have created.</p>
                    </div>

                    <div style={cardStyle}>
                        <div style={{ fontSize: "35px" }}>🔖</div>
                        <h3>Saved Blogs</h3>
                        <p>View your saved health and wellness articles.</p>
                    </div>

                    <div style={cardStyle}>
                        <div style={{ fontSize: "35px" }}>❤️</div>
                        <h3>Health</h3>
                        <p>Explore your health and wellness activities.</p>
                    </div>

                    <div style={cardStyle}>
                        <div style={{ fontSize: "35px" }}>👤</div>
                        <h3>Profile</h3>
                        <p>Manage your HealthNest profile.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
};

export default Dashboard;