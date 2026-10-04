import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
    const [stats, setStats] = useState({
        health_articles: 0,
        readers: 0,
        health_topics: 0,
        community_interactions: 0,
        health_reels: 0,
    });

    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/stats/"
                );

                let reelsCount = 0;

                try {
                    const reelsResponse = await axios.get(
                        "http://127.0.0.1:8000/api/reels/"
                    );

                    reelsCount =
                        reelsResponse.data.count || 0;
                } catch (reelError) {
                    console.error(
                        "Failed to load reel count:",
                        reelError
                    );
                }

                setStats({
                    ...response.data,
                    health_reels: reelsCount,
                });

            } catch (error) {
                console.error(
                    "Failed to load HealthNest statistics:",
                    error
                );
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const categories = [
        {
            icon: "🏋️",
            title: "Fitness",
            description:
                "Workouts, exercise routines and practical fitness tips.",
        },
        {
            icon: "🥗",
            title: "Nutrition",
            description:
                "Healthy food choices, nutrition tips and balanced diets.",
        },
        {
            icon: "🧠",
            title: "Mental Wellness",
            description:
                "Stress management, mindfulness and emotional wellness.",
        },
        {
            icon: "😴",
            title: "Sleep",
            description:
                "Better sleep habits and tips for improving your routine.",
        },
        {
            icon: "📚",
            title: "Study & Health",
            description:
                "Health tips for maintaining a balance between study and life.",
        },
        {
            icon: "❤️",
            title: "Healthy Habits",
            description:
                "Small everyday habits that can improve your lifestyle.",
        },
    ];

    const blogs = [
        {
            id: 1,
            image: "🏋️",
            category: "Fitness",
            title: "A Beginner's Guide to Staying Fit",
            description:
                "Simple fitness habits and workout ideas for students who are just getting started.",
        },
        {
            id: 2,
            image: "🥗",
            category: "Nutrition",
            title: "Healthy Food Choices for Students",
            description:
                "Easy and practical nutrition tips that can fit into a busy student lifestyle.",
        },
        {
            id: 3,
            image: "🧠",
            category: "Mental Wellness",
            title: "How to Manage Exam Stress",
            description:
                "Learn simple ways to manage study pressure and create a healthier routine.",
        },
    ];

    const formatNumber = (number) => {
        if (number >= 1000) {
            return `${(number / 1000)
                .toFixed(1)
                .replace(".0", "")}K+`;
        }

        return number;
    };

    return (
        <main className="home-container">

            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-small">
                        YOUR HEALTH & WELLNESS BLOG
                    </p>

                    <h1>
                        Healthy Habits for a{" "}
                        <span>Brighter Student Life</span>
                    </h1>

                    <p className="hero-description">
                        Discover useful health and wellness articles
                        created to help students build better habits,
                        stay active and live healthier.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/blogs">
                            <button>
                                Explore Blogs →
                            </button>
                        </Link>

                        <Link to="/register">
                            <button className="secondary-btn">
                                Join HealthNest
                            </button>
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="hero-circle">
                        🌿
                    </div>

                    <div className="hero-floating-card card-one">
                        ❤️
                        <span>
                            Healthy
                            <br />
                            Living
                        </span>
                    </div>

                    <div className="hero-floating-card card-two">
                        🧘
                        <span>
                            Mind
                            <br />
                            Wellness
                        </span>
                    </div>

                    <div className="hero-floating-card card-three">
                        🥗
                        <span>
                            Better
                            <br />
                            Nutrition
                        </span>
                    </div>

                </div>

            </section>


            {/* =====================================================
                STATISTICS
            ===================================================== */}

            <section className="home-stats">

                {/* HEALTH ARTICLES */}

                <div className="stat-item">

                    <div className="stat-icon">
                        📖
                    </div>

                    <div>
                        <strong>
                            {statsLoading
                                ? "..."
                                : formatNumber(
                                    stats.health_articles
                                )}
                        </strong>

                        <span>
                            Health Articles
                        </span>
                    </div>

                </div>


                {/* READERS */}

                <div className="stat-item">

                    <div className="stat-icon">
                        👥
                    </div>

                    <div>
                        <strong>
                            {statsLoading
                                ? "..."
                                : formatNumber(
                                    stats.readers
                                )}
                        </strong>

                        <span>
                            Readers
                        </span>
                    </div>

                </div>


                {/* HEALTH TOPICS */}

                <div className="stat-item">

                    <div className="stat-icon">
                        🌱
                    </div>

                    <div>
                        <strong>
                            {statsLoading
                                ? "..."
                                : formatNumber(
                                    stats.health_topics
                                )}
                        </strong>

                        <span>
                            Health Topics
                        </span>
                    </div>

                </div>


                {/* COMMUNITY INTERACTIONS */}

                <div className="stat-item">

                    <div className="stat-icon">
                        💬
                    </div>

                    <div>
                        <strong>
                            {statsLoading
                                ? "..."
                                : formatNumber(
                                    stats.community_interactions
                                )}
                        </strong>

                        <span>
                            Community Interactions
                        </span>
                    </div>

                </div>


                {/* HEALTH REELS */}

                <div className="stat-item">

                    <div className="stat-icon">
                        🎬
                    </div>

                    <div>
                        <strong>
                            {statsLoading
                                ? "..."
                                : formatNumber(
                                    stats.health_reels
                                )}
                        </strong>

                        <span>
                            Health Reels
                        </span>
                    </div>

                </div>

            </section>


            {/* =====================================================
                EXPLORE HEALTH TOPICS
            ===================================================== */}

            <section className="explore-section">

                <div className="section-heading">

                    <p>
                        EXPLORE
                    </p>

                    <h2>
                        Explore Health Topics
                    </h2>

                    <span>
                        Find practical health and wellness
                        information for everyday life.
                    </span>

                </div>


                <div className="categories">

                    {categories.map((category) => (

                        <Link
                            to="/categories"
                            className="category"
                            key={category.title}
                        >

                            <div className="category-icon">
                                {category.icon}
                            </div>

                            <h3>
                                {category.title}
                            </h3>

                            <p>
                                {category.description}
                            </p>

                            <span className="category-link">
                                Explore →
                            </span>

                        </Link>

                    ))}

                </div>

            </section>


            {/* =====================================================
                FEATURED BLOGS
            ===================================================== */}

            <section className="blogs-section">

                <div className="section-heading">

                    <p>
                        FEATURED ARTICLES
                    </p>

                    <h2>
                        Trending on HealthNest
                    </h2>

                    <span>
                        Helpful articles to support your
                        health and wellness journey.
                    </span>

                </div>


                <div className="blog-grid">

                    {blogs.map((blog) => (

                        <article
                            className="home-featured-card"
                            key={blog.id}
                        >

                            <div className="home-featured-icon">
                                {blog.image}
                            </div>

                            <span className="home-featured-category">
                                {blog.category}
                            </span>

                            <h3>
                                {blog.title}
                            </h3>

                            <p>
                                {blog.description}
                            </p>

                            <Link
                                to={`/blog/${blog.id}`}
                                className="home-featured-btn"
                            >
                                Read Article →
                            </Link>

                        </article>

                    ))}

                </div>


                <div className="view-all-wrapper">

                    <Link to="/blogs">

                        <button className="view-all-btn">
                            View All Blogs →
                        </button>

                    </Link>

                </div>

            </section>


            {/* =====================================================
                WHY HEALTHNEST
            ===================================================== */}

            <section className="why-healthnest">

                <div className="section-heading">

                    <p>
                        WHY HEALTHNEST?
                    </p>

                    <h2>
                        Build Better Habits,
                        <br className="desktop-break" />
                        One Article at a Time
                    </h2>

                    <span>
                        Simple knowledge can make a big
                        difference in your everyday lifestyle.
                    </span>

                </div>


                <div className="why-grid">

                    <div className="why-card">

                        <div className="why-icon">
                            📖
                        </div>

                        <h3>
                            Useful Content
                        </h3>

                        <p>
                            Explore easy-to-understand health
                            and wellness articles designed
                            for students.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            👥
                        </div>

                        <h3>
                            Student Community
                        </h3>

                        <p>
                            Share experiences and discuss
                            healthy lifestyle topics with
                            the community.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            🌱
                        </div>

                        <h3>
                            Healthy Growth
                        </h3>

                        <p>
                            Discover practical habits that
                            can fit naturally into everyday
                            student life.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                HEALTH FEATURES
            ===================================================== */}

            <section className="home-health-features">

                <div className="section-heading">

                    <p>
                        HEALTHNEST FEATURES
                    </p>

                    <h2>
                        More Than Just a Blog
                    </h2>

                    <span>
                        Tools and community features to help
                        you build a healthier lifestyle.
                    </span>

                </div>


                <div className="home-feature-grid">

                    <Link
                        to="/health-tracker"
                        className="home-feature-box"
                    >

                        <div className="home-feature-box-icon">
                            ❤️
                        </div>

                        <h3>
                            Health Tracker
                        </h3>

                        <p>
                            Track water, sleep, exercise,
                            steps and weight in one place.
                        </p>

                        <span>
                            Track Health →
                        </span>

                    </Link>


                    <Link
                        to="/recommendations"
                        className="home-feature-box"
                    >

                        <div className="home-feature-box-icon">
                            🤖
                        </div>

                        <h3>
                            AI Recommendations
                        </h3>

                        <p>
                            Get personalized wellness
                            suggestions based on your
                            health information.
                        </p>

                        <span>
                            Get Recommendations →
                        </span>

                    </Link>


                    <Link
                        to="/community"
                        className="home-feature-box"
                    >

                        <div className="home-feature-box-icon">
                            🤝
                        </div>

                        <h3>
                            Health Community
                        </h3>

                        <p>
                            Read, share and discuss health
                            experiences with other users.
                        </p>

                        <span>
                            Join Community →
                        </span>

                    </Link>

                </div>

            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="home-cta">

                <div className="home-cta-content">

                    <div className="home-cta-icon">
                        🌿
                    </div>

                    <h2>
                        Ready to Start Your Health Journey?
                    </h2>

                    <p>
                        Read, learn and share healthier ideas
                        with the HealthNest community.
                    </p>

                    <div className="home-cta-buttons">

                        <Link to="/register">
                            <button>
                                Join HealthNest
                            </button>
                        </Link>

                        <Link to="/blogs">
                            <button className="cta-secondary">
                                Explore Blogs
                            </button>
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;