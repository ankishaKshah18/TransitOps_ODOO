import { useEffect, useState } from "react";
import {
    BusFront,
    Route,
    Users,
    Wrench,
    Activity,
    RefreshCw,
} from "lucide-react";

import api from "../services/api";

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/dashboard");
            setData(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="state-box">
                <div className="spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="state-box">
                <p className="error-text">{error}</p>

                <button
                    className="primary-button"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={17} />
                    Try Again
                </button>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Vehicles",
            value: data.total_vehicles,
            subtitle: `${data.available_vehicles} available`,
            icon: BusFront,
        },
        {
            title: "Active Trips",
            value: data.active_trips,
            subtitle: `${data.pending_trips} pending`,
            icon: Route,
        },
        {
            title: "Available Drivers",
            value: data.drivers_available,
            subtitle: `${data.drivers_on_duty} currently on duty`,
            icon: Users,
        },
        {
            title: "In Maintenance",
            value: data.vehicles_in_maintenance,
            subtitle: "Vehicles currently in shop",
            icon: Wrench,
        },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">OVERVIEW</p>
                    <h1>Fleet Dashboard</h1>
                    <p>
                        Real-time overview of your transport operations.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            <section className="stats-grid">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            className="stat-card"
                            key={card.title}
                        >
                            <div className="stat-card-top">
                                <div className="stat-icon">
                                    <Icon size={23} />
                                </div>

                                <Activity
                                    size={18}
                                    className="trend-icon"
                                />
                            </div>

                            <h2>{card.value}</h2>
                            <h3>{card.title}</h3>
                            <p>{card.subtitle}</p>
                        </article>
                    );
                })}
            </section>

            <section className="dashboard-grid">
                <div className="content-card">
                    <div className="card-heading">
                        <div>
                            <h2>Fleet Utilization</h2>
                            <p>Current operational usage</p>
                        </div>

                        <strong>
                            {data.fleet_utilization}%
                        </strong>
                    </div>

                    <div className="progress-track">
                        <div
                            className="progress-value"
                            style={{
                                width: `${Math.min(
                                    data.fleet_utilization,
                                    100
                                )}%`,
                            }}
                        />
                    </div>

                    <div className="utilization-details">
                        <span>
                            {data.vehicles_on_trip} vehicles on trip
                        </span>

                        <span>
                            {data.available_vehicles} available
                        </span>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-heading">
                        <div>
                            <h2>Operational Status</h2>
                            <p>Current fleet availability</p>
                        </div>
                    </div>

                    <div className="status-list">
                        <div>
                            <span className="status-dot available" />
                            <p>Available Vehicles</p>
                            <strong>{data.available_vehicles}</strong>
                        </div>

                        <div>
                            <span className="status-dot active" />
                            <p>Vehicles On Trip</p>
                            <strong>{data.vehicles_on_trip}</strong>
                        </div>

                        <div>
                            <span className="status-dot maintenance" />
                            <p>In Maintenance</p>
                            <strong>
                                {data.vehicles_in_maintenance}
                            </strong>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;