import { Link } from "react-router-dom";

function About() {
    const features = [
        {
            icon: "📖",
            title: "Read Blogs",
            text: "Explore articles about fitness, nutrition, sleep and wellness.",
        },
        {
            icon: "✍️",
            title: "Create Content",
            text: "Registered users can create and share their own health articles.",
        },
        {
            icon: "💬",
            title: "Join Community",
            text: "Discuss health topics and exchange useful experiences.",
        },
        {
            icon: "🔎",
            title: "Discover",
            text: "Find content based on your interests and health topics.",
        },
    ];

    const topics = [
        "🏋️ Fitness",
        "🥗 Nutrition",
        "🧠 Mental Wellness",
        "😴 Sleep",
        "📚 Study & Health",
        "💧 Healthy Habits",
    ];

    return (
        <main className="about-page">

            {/* HERO */}
            <section className="about-hero">

                <div className="about-hero-icon">
                    🌿
                </div>

                <p className="about-label">
                    ABOUT HEALTHNEST
                </p>

                <h1>
                    Your Health. Your Knowledge.
                    <br className="about-desktop-break" />
                    Your Community.
                </h1>

                <p className="about-hero-text">
                    HealthNest is a student-focused health and
                    wellness blogging platform where people can
                    discover useful health information, share
                    experiences and build healthier everyday habits.
                </p>

            </section>

            {/* MISSION */}
            <section className="about-mission">

                <div className="about-mission-card">

                    <h2>
                        🌱 Our Mission
                    </h2>

                    <p>
                        Our goal is to make health and wellness
                        information easier to discover and understand.
                        HealthNest brings articles, discussions and
                        practical lifestyle tips together in one
                        simple platform.
                    </p>

                </div>

            </section>

            {/* FEATURES */}
            <section className="about-features">

                <h2>
                    What You Can Do on HealthNest
                </h2>

                <div className="about-feature-grid">

                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="about-feature-card"
                        >

                            <div className="about-feature-icon">
                                {feature.icon}
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.text}
                            </p>

                        </div>
                    ))}

                </div>

            </section>

            {/* TOPICS */}
            <section className="about-topics">

                <h2>
                    Our Main Topics
                </h2>

                <p>
                    Explore different areas of health and wellness.
                </p>

                <div className="about-topic-list">

                    {topics.map((topic) => (
                        <span
                            key={topic}
                            className="about-topic"
                        >
                            {topic}
                        </span>
                    ))}

                </div>

            </section>

            {/* CTA */}
            <section className="about-cta">

                <h2>
                    Start Your HealthNest Journey
                </h2>

                <p>
                    Explore health articles, discover useful habits
                    and connect with the community.
                </p>

                <Link
                    to="/blogs"
                    className="about-cta-link"
                >
                    Explore Blogs →
                </Link>

            </section>

        </main>
    );
}

export default About;