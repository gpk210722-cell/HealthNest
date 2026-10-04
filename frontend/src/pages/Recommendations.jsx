import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Recommendations() {
    const navigate = useNavigate();

    const savedUser =
        localStorage.getItem("healthnest_user");

    const user = savedUser
        ? JSON.parse(savedUser)
        : null;

    const [recommendations, setRecommendations] =
        useState([]);

    const [healthData, setHealthData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/recommendations/user/${user.id}`
                );

                setRecommendations(
                    response.data.recommendations || []
                );

                setHealthData(
                    response.data.based_on || null
                );
            } catch (error) {
                console.error(
                    "Recommendation error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    /* LOGIN REQUIRED */

    if (!user) {
        return (
            <main className="recommendations-page recommendations-login-page">

                <div className="recommendations-login-card">

                    <div className="recommendations-login-icon">
                        🔐
                    </div>

                    <h1>
                        Login Required
                    </h1>

                    <p>
                        Please login to see your personalized
                        health recommendations.
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

    /* LOADING */

    if (loading) {
        return (
            <main className="recommendations-page">

                <div className="recommendations-loading">
                    <div className="recommendations-loading-icon">
                        🤖
                    </div>

                    <h2>
                        Loading your recommendations...
                    </h2>
                </div>

            </main>
        );
    }

    return (
        <main className="recommendations-page">

            <div className="recommendations-container">

                {/* HEADER */}

                <header className="recommendations-header">

                    <h1>
                        🤖 AI Health Recommendations
                    </h1>

                    <p>
                        Personalized wellness suggestions
                        based on your latest health data.
                    </p>

                </header>

                {/* HEALTH DATA */}

                {healthData && (
                    <section className="recommendations-data-card">

                        <h2>
                            📊 Your Latest Health Data
                        </h2>

                        <div className="recommendation-stats">

                            <div className="recommendation-stat">
                                <span className="recommendation-stat-icon">
                                    💧
                                </span>

                                <strong>
                                    {healthData.water_intake} L
                                </strong>

                                <span>
                                    Water
                                </span>
                            </div>

                            <div className="recommendation-stat">
                                <span className="recommendation-stat-icon">
                                    😴
                                </span>

                                <strong>
                                    {healthData.sleep_hours} hrs
                                </strong>

                                <span>
                                    Sleep
                                </span>
                            </div>

                            <div className="recommendation-stat">
                                <span className="recommendation-stat-icon">
                                    🏃
                                </span>

                                <strong>
                                    {healthData.exercise_minutes} min
                                </strong>

                                <span>
                                    Exercise
                                </span>
                            </div>

                            <div className="recommendation-stat">
                                <span className="recommendation-stat-icon">
                                    👣
                                </span>

                                <strong>
                                    {healthData.steps}
                                </strong>

                                <span>
                                    Steps
                                </span>
                            </div>

                            <div className="recommendation-stat">
                                <span className="recommendation-stat-icon">
                                    ⚖️
                                </span>

                                <strong>
                                    {healthData.weight} kg
                                </strong>

                                <span>
                                    Weight
                                </span>
                            </div>

                        </div>

                    </section>
                )}

                {/* RECOMMENDATIONS */}

                <section className="recommendations-card">

                    <h2>
                        💡 Personalized Suggestions
                    </h2>

                    {recommendations.length === 0 ? (

                        <div className="recommendations-empty">
                            <div>
                                💡
                            </div>

                            <p>
                                No recommendations available yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/health-tracker"
                                    )
                                }
                            >
                                Add Health Data
                            </button>
                        </div>

                    ) : (

                        <div className="recommendations-list">

                            {recommendations.map(
                                (recommendation, index) => (
                                    <div
                                        key={index}
                                        className="recommendation-item"
                                    >
                                        <span className="recommendation-number">
                                            {index + 1}
                                        </span>

                                        <p>
                                            {recommendation}
                                        </p>
                                    </div>
                                )
                            )}

                        </div>

                    )}

                </section>

                {/* UPDATE BUTTON */}

                <div className="recommendations-update">

                    <button
                        onClick={() =>
                            navigate(
                                "/health-tracker"
                            )
                        }
                    >
                        ❤️ Update Health Data
                    </button>

                </div>

            </div>

        </main>
    );
}

export default Recommendations;