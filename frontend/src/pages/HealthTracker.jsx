import { useEffect, useState } from "react";
import axios from "axios";

function HealthTracker() {
    const user = JSON.parse(
        localStorage.getItem("healthnest_user")
    );

    const [form, setForm] = useState({
        water_intake: "",
        sleep_hours: "",
        exercise_minutes: "",
        steps: "",
        weight: "",
    });

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const API =
        "http://127.0.0.1:8000/api/health-records";

    const fetchRecords = async () => {
        if (!user) return;

        try {
            const response = await axios.get(
                `${API}/user/${user.id}`
            );

            setRecords(response.data);
        } catch (error) {
            console.error(
                "Error loading health records:",
                error
            );
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${API}/`, null, {
                params: {
                    user_id: user.id,
                    water_intake:
                        Number(form.water_intake) || 0,
                    sleep_hours:
                        Number(form.sleep_hours) || 0,
                    exercise_minutes:
                        Number(form.exercise_minutes) || 0,
                    steps:
                        Number(form.steps) || 0,
                    weight:
                        Number(form.weight) || 0,
                },
            });

            alert(
                "Health record saved successfully!"
            );

            setForm({
                water_intake: "",
                sleep_hours: "",
                exercise_minutes: "",
                steps: "",
                weight: "",
            });

            fetchRecords();
        } catch (error) {
            console.error(error);
            alert(
                "Unable to save health record."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id) => {
        if (!user) return;

        if (
            !window.confirm(
                "Delete this health record?"
            )
        ) {
            return;
        }

        try {
            await axios.delete(`${API}/${id}`, {
                params: {
                    user_id: user.id,
                },
            });

            fetchRecords();
        } catch (error) {
            console.error(error);
            alert(
                "Unable to delete record."
            );
        }
    };

    if (!user) {
        return (
            <main className="health-tracker-page">
                <div className="health-login-message">
                    <div className="health-login-icon">
                        ❤️
                    </div>

                    <h2>
                        Please login to use Health Tracker
                    </h2>
                </div>
            </main>
        );
    }

    return (
        <main className="health-tracker-page">

            <div className="health-tracker-container">

                {/* HEADER */}

                <header className="health-tracker-header">

                    <h1>
                        ❤️ Health Tracker
                    </h1>

                    <p>
                        Track your daily health and
                        wellness activities.
                    </p>

                </header>

                {/* FORM */}

                <section className="health-record-form">

                    <h2>
                        Add Today's Health Record
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="health-form-grid">

                            <input
                                type="number"
                                step="0.1"
                                name="water_intake"
                                placeholder="💧 Water Intake (Litres)"
                                value={
                                    form.water_intake
                                }
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                step="0.1"
                                name="sleep_hours"
                                placeholder="😴 Sleep Hours"
                                value={
                                    form.sleep_hours
                                }
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="exercise_minutes"
                                placeholder="🏃 Exercise Minutes"
                                value={
                                    form.exercise_minutes
                                }
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="steps"
                                placeholder="👣 Steps"
                                value={form.steps}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                step="0.1"
                                name="weight"
                                placeholder="⚖️ Weight (kg)"
                                value={form.weight}
                                onChange={handleChange}
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="health-save-button"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Health Record"}
                        </button>

                    </form>

                </section>

                {/* RECORDS */}

                <section className="health-records-section">

                    <div className="health-records-title">

                        <h2>
                            📊 My Health Records
                        </h2>

                        <span>
                            {records.length}{" "}
                            {records.length === 1
                                ? "record"
                                : "records"}
                        </span>

                    </div>

                    {records.length === 0 ? (

                        <div className="health-no-records">

                            <div>
                                📊
                            </div>

                            <h3>
                                No health records yet
                            </h3>

                            <p>
                                Add your first health record
                                above to start tracking.
                            </p>

                        </div>

                    ) : (

                        <div className="health-record-grid">

                            {records.map((record) => (

                                <article
                                    key={record.id}
                                    className="health-record-card"
                                >

                                    <div className="health-record-item">
                                        <span>💧 Water</span>
                                        <strong>
                                            {record.water_intake} L
                                        </strong>
                                    </div>

                                    <div className="health-record-item">
                                        <span>😴 Sleep</span>
                                        <strong>
                                            {record.sleep_hours} hrs
                                        </strong>
                                    </div>

                                    <div className="health-record-item">
                                        <span>🏃 Exercise</span>
                                        <strong>
                                            {record.exercise_minutes} min
                                        </strong>
                                    </div>

                                    <div className="health-record-item">
                                        <span>👣 Steps</span>
                                        <strong>
                                            {record.steps}
                                        </strong>
                                    </div>

                                    <div className="health-record-item">
                                        <span>⚖️ Weight</span>
                                        <strong>
                                            {record.weight} kg
                                        </strong>
                                    </div>

                                    <div className="health-record-date">
                                        {new Date(
                                            record.created_at
                                        ).toLocaleString()}
                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteRecord(
                                                record.id
                                            )
                                        }
                                        className="health-delete-button"
                                    >
                                        🗑️ Delete
                                    </button>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

export default HealthTracker;