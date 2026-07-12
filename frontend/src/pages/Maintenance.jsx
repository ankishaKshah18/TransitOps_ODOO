import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    RefreshCw,
    X,
    Wrench,
    Calendar,
    CheckCircle2,
    PlayCircle,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
    vehicle_id: "",
    service_type: "",
    description: "",
    scheduled_date: "",
    completed_date: "",
    cost: "",
    service_provider: "",
    status: "Scheduled",
};

function Maintenance() {
    const [records, setRecords] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // =========================
    // LOAD DATA
    // =========================

    const loadData = async () => {
        try {
            setLoading(true);

            const [maintenanceResponse, vehiclesResponse] =
                await Promise.all([
                    api.get("/maintenance"),
                    api.get("/vehicles"),
                ]);

            setRecords(maintenanceResponse.data);
            setVehicles(vehiclesResponse.data);
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load maintenance records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================
    // FORM
    // =========================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/maintenance", {
                ...form,
                vehicle_id: Number(form.vehicle_id),
                cost: Number(form.cost || 0),
            });

            setForm(initialForm);
            setShowModal(false);
            setMessage("Maintenance record created successfully.");

            loadData();
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Unable to create maintenance record."
            );
        }
    };

    // =========================
    // STATUS ACTIONS
    // =========================

    const startMaintenance = async (id) => {
        try {
            await api.put(`/maintenance/${id}`, {
                status: "In Progress",
            });

            setMessage("Maintenance started successfully.");
            loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to start maintenance."
            );
        }
    };

    const completeMaintenance = async (id) => {
        try {
            await api.put(`/maintenance/${id}`, {
                status: "Completed",
                completed_date: new Date()
                    .toISOString()
                    .split("T")[0],
            });

            setMessage("Maintenance completed successfully.");
            loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to complete maintenance."
            );
        }
    };

    // =========================
    // HELPERS
    // =========================

    const getVehicle = (vehicleId) => {
        return vehicles.find(
            (vehicle) => vehicle.id === vehicleId
        );
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredRecords = records.filter((record) => {
        const text = search.toLowerCase();

        const vehicle = getVehicle(record.vehicle_id);

        const matchesSearch =
            record.service_type
                ?.toLowerCase()
                .includes(text) ||
            record.description
                ?.toLowerCase()
                .includes(text) ||
            record.service_provider
                ?.toLowerCase()
                .includes(text) ||
            vehicle?.name?.toLowerCase().includes(text) ||
            vehicle?.registration_number
                ?.toLowerCase()
                .includes(text);

        const matchesStatus =
            statusFilter === "All" ||
            record.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            {/* PAGE HEADER */}

            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        FLEET MAINTENANCE
                    </p>

                    <h1>Maintenance</h1>

                    <p>
                        Schedule services and track vehicle maintenance
                        operations.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Schedule Maintenance
                </button>
            </div>

            {/* MESSAGE */}

            {message && (
                <div className="alert-message">
                    {message}
                </div>
            )}

            {/* SUMMARY CARDS */}

            <div className="trip-summary-grid">
                <div className="trip-summary-card">
                    <span>Total Records</span>
                    <strong>{records.length}</strong>
                </div>

                <div className="trip-summary-card">
                    <span>Scheduled</span>

                    <strong>
                        {
                            records.filter(
                                (record) =>
                                    record.status === "Scheduled"
                            ).length
                        }
                    </strong>
                </div>

                <div className="trip-summary-card">
                    <span>In Progress</span>

                    <strong>
                        {
                            records.filter(
                                (record) =>
                                    record.status === "In Progress"
                            ).length
                        }
                    </strong>
                </div>

                <div className="trip-summary-card">
                    <span>Completed</span>

                    <strong>
                        {
                            records.filter(
                                (record) =>
                                    record.status === "Completed"
                            ).length
                        }
                    </strong>
                </div>
            </div>

            {/* MAIN CARD */}

            <div className="content-card">
                {/* TOOLBAR */}

                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search maintenance records..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="toolbar-actions">
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="All">
                                All Statuses
                            </option>

                            <option value="Scheduled">
                                Scheduled
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Completed">
                                Completed
                            </option>
                        </select>

                        <button
                            className="secondary-button"
                            onClick={loadData}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* TABLE */}

                {loading ? (
                    <div className="state-box">
                        <div className="spinner" />
                        <p>Loading maintenance records...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Service</th>
                                    <th>Scheduled Date</th>
                                    <th>Provider</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRecords.map((record) => {
                                    const vehicle = getVehicle(
                                        record.vehicle_id
                                    );

                                    return (
                                        <tr key={record.id}>
                                            {/* VEHICLE */}

                                            <td>
                                                <div className="vehicle-cell">
                                                    <div className="table-icon">
                                                        <Wrench size={18} />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {vehicle?.name ||
                                                                `Vehicle #${record.vehicle_id}`}
                                                        </strong>

                                                        <span>
                                                            {vehicle?.registration_number ||
                                                                "Vehicle"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* SERVICE */}

                                            <td>
                                                <strong>
                                                    {record.service_type}
                                                </strong>

                                                <div className="muted-text">
                                                    {record.description ||
                                                        "No description"}
                                                </div>
                                            </td>

                                            {/* DATE */}

                                            <td>
                                                <div className="contact-cell">
                                                    <Calendar size={14} />

                                                    {formatDate(
                                                        record.scheduled_date
                                                    )}
                                                </div>
                                            </td>

                                            {/* PROVIDER */}

                                            <td>
                                                {record.service_provider ||
                                                    "—"}
                                            </td>

                                            {/* COST */}

                                            <td>
                                                <strong>
                                                    ₹
                                                    {Number(
                                                        record.cost || 0
                                                    ).toLocaleString("en-IN")}
                                                </strong>
                                            </td>

                                            {/* STATUS */}

                                            <td>
                                                <span
                                                    className={`status-badge ${record.status
                                                        ?.toLowerCase()
                                                        .replaceAll(" ", "-")}`}
                                                >
                                                    {record.status}
                                                </span>
                                            </td>

                                            {/* ACTIONS */}

                                            <td>
                                                <div className="action-buttons">
                                                    {record.status ===
                                                        "Scheduled" && (
                                                            <button
                                                                className="action-button dispatch"
                                                                onClick={() =>
                                                                    startMaintenance(
                                                                        record.id
                                                                    )
                                                                }
                                                            >
                                                                <PlayCircle
                                                                    size={15}
                                                                />

                                                                Start
                                                            </button>
                                                        )}

                                                    {record.status ===
                                                        "In Progress" && (
                                                            <button
                                                                className="action-button complete"
                                                                onClick={() =>
                                                                    completeMaintenance(
                                                                        record.id
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle2
                                                                    size={15}
                                                                />

                                                                Complete
                                                            </button>
                                                        )}

                                                    {record.status ===
                                                        "Completed" && (
                                                            <span className="completed-text">
                                                                <CheckCircle2
                                                                    size={15}
                                                                />

                                                                Finished
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredRecords.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-table"
                                        >
                                            No maintenance records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD MAINTENANCE MODAL */}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        {/* MODAL HEADER */}

                        <div className="modal-header">
                            <div>
                                <h2>
                                    Schedule Maintenance
                                </h2>

                                <p>
                                    Create a new vehicle maintenance
                                    record.
                                </p>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {/* VEHICLE */}

                                <label>
                                    Vehicle

                                    <select
                                        name="vehicle_id"
                                        value={form.vehicle_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select vehicle
                                        </option>

                                        {vehicles.map((vehicle) => (
                                            <option
                                                key={vehicle.id}
                                                value={vehicle.id}
                                            >
                                                {vehicle.name} -{" "}
                                                {
                                                    vehicle.registration_number
                                                }
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {/* SERVICE TYPE */}

                                <label>
                                    Service Type

                                    <select
                                        name="service_type"
                                        value={form.service_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select service
                                        </option>

                                        <option value="Routine Service">
                                            Routine Service
                                        </option>

                                        <option value="Oil Change">
                                            Oil Change
                                        </option>

                                        <option value="Tyre Service">
                                            Tyre Service
                                        </option>

                                        <option value="Brake Service">
                                            Brake Service
                                        </option>

                                        <option value="Engine Repair">
                                            Engine Repair
                                        </option>

                                        <option value="Electrical Repair">
                                            Electrical Repair
                                        </option>

                                        <option value="Inspection">
                                            Inspection
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </label>

                                {/* DATE */}

                                <label>
                                    Scheduled Date

                                    <input
                                        type="date"
                                        name="scheduled_date"
                                        value={form.scheduled_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                {/* PROVIDER */}

                                <label>
                                    Service Provider

                                    <input
                                        type="text"
                                        name="service_provider"
                                        value={
                                            form.service_provider
                                        }
                                        onChange={handleChange}
                                        placeholder="Workshop or service centre"
                                    />
                                </label>

                                {/* COST */}

                                <label>
                                    Estimated Cost (₹)

                                    <input
                                        type="number"
                                        min="0"
                                        name="cost"
                                        value={form.cost}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </label>

                                {/* STATUS */}

                                <label>
                                    Status

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Scheduled">
                                            Scheduled
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>
                                    </select>
                                </label>

                                {/* DESCRIPTION */}

                                <label className="full-width-field">
                                    Description

                                    <textarea
                                        className="form-textarea"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe the maintenance work required..."
                                        rows="4"
                                    />
                                </label>
                            </div>

                            {/* ACTIONS */}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    <Plus size={17} />

                                    Schedule Maintenance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Maintenance;