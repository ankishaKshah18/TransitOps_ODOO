import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    RefreshCw,
    X,
    MapPin,
    Navigation,
    Play,
    CheckCircle2,
    Route,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
    trip_name: "",
    origin: "",
    destination: "",
    vehicle_id: "",
    driver_id: "",
    scheduled_start: "",
    scheduled_end: "",
    cargo_description: "",
    cargo_weight: "",
    distance: "",
    status: "Pending",
};

function Trips() {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);

            const [tripsResponse, vehiclesResponse, driversResponse] =
                await Promise.all([
                    api.get("/trips"),
                    api.get("/vehicles"),
                    api.get("/drivers"),
                ]);

            setTrips(tripsResponse.data);
            setVehicles(vehiclesResponse.data);
            setDrivers(driversResponse.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load trip data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/trips", {
                ...form,
                vehicle_id: Number(form.vehicle_id),
                driver_id: Number(form.driver_id),
                cargo_weight: Number(form.cargo_weight || 0),
                distance: Number(form.distance || 0),
            });

            setForm(initialForm);
            setShowModal(false);
            setMessage("Trip created successfully.");
            loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to create trip."
            );
        }
    };

    const dispatchTrip = async (id) => {
        try {
            await api.put(`/trips/${id}/dispatch`);
            setMessage("Trip dispatched successfully.");
            loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to dispatch trip."
            );
        }
    };

    const completeTrip = async (id) => {
        try {
            await api.put(`/trips/${id}/complete`);
            setMessage("Trip completed successfully.");
            loadData();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to complete trip."
            );
        }
    };

    const filteredTrips = trips.filter((trip) => {
        const text = search.toLowerCase();

        const matchesSearch =
            trip.trip_name?.toLowerCase().includes(text) ||
            trip.origin?.toLowerCase().includes(text) ||
            trip.destination?.toLowerCase().includes(text);

        const matchesStatus =
            statusFilter === "All" ||
            trip.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getVehicleName = (vehicleId) => {
        const vehicle = vehicles.find(
            (item) => item.id === vehicleId
        );

        return vehicle
            ? `${vehicle.name} (${vehicle.registration_number})`
            : `Vehicle #${vehicleId}`;
    };

    const getDriverName = (driverId) => {
        const driver = drivers.find(
            (item) => item.id === driverId
        );

        return driver?.name || `Driver #${driverId}`;
    };

    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">TRIP OPERATIONS</p>
                    <h1>Trips</h1>
                    <p>
                        Plan, dispatch and monitor transport operations.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Create Trip
                </button>
            </div>

            {message && (
                <div className="alert-message">
                    {message}
                </div>
            )}

            <div className="trip-summary-grid">
                <div className="trip-summary-card">
                    <span>Total Trips</span>
                    <strong>{trips.length}</strong>
                </div>

                <div className="trip-summary-card">
                    <span>Pending</span>
                    <strong>
                        {
                            trips.filter(
                                (trip) => trip.status === "Pending"
                            ).length
                        }
                    </strong>
                </div>

                <div className="trip-summary-card">
                    <span>Active</span>
                    <strong>
                        {
                            trips.filter(
                                (trip) => trip.status === "Active"
                            ).length
                        }
                    </strong>
                </div>

                <div className="trip-summary-card">
                    <span>Completed</span>
                    <strong>
                        {
                            trips.filter(
                                (trip) => trip.status === "Completed"
                            ).length
                        }
                    </strong>
                </div>
            </div>

            <div className="content-card">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} />

                        <input
                            placeholder="Search by trip or location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Completed">
                                Completed
                            </option>
                            <option value="Cancelled">
                                Cancelled
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

                {loading ? (
                    <div className="state-box">
                        <div className="spinner" />
                        <p>Loading trips...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Trip</th>
                                    <th>Route</th>
                                    <th>Vehicle</th>
                                    <th>Driver</th>
                                    <th>Distance</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTrips.map((trip) => (
                                    <tr key={trip.id}>
                                        <td>
                                            <div className="vehicle-cell">
                                                <div className="table-icon">
                                                    <Route size={18} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {trip.trip_name ||
                                                            `Trip #${trip.id}`}
                                                    </strong>

                                                    <span>
                                                        ID #{trip.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="route-cell">
                                                <span>
                                                    <MapPin size={13} />
                                                    {trip.origin}
                                                </span>

                                                <span className="route-arrow">
                                                    ↓
                                                </span>

                                                <span>
                                                    <Navigation size={13} />
                                                    {trip.destination}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            {getVehicleName(trip.vehicle_id)}
                                        </td>

                                        <td>
                                            {getDriverName(trip.driver_id)}
                                        </td>

                                        <td>
                                            {trip.distance
                                                ? `${trip.distance} km`
                                                : "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${trip.status
                                                    ?.toLowerCase()
                                                    .replaceAll(" ", "-")}`}
                                            >
                                                {trip.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">
                                                {trip.status === "Pending" && (
                                                    <button
                                                        className="action-button dispatch"
                                                        onClick={() =>
                                                            dispatchTrip(trip.id)
                                                        }
                                                        title="Dispatch Trip"
                                                    >
                                                        <Play size={15} />
                                                        Dispatch
                                                    </button>
                                                )}

                                                {trip.status === "Active" && (
                                                    <button
                                                        className="action-button complete"
                                                        onClick={() =>
                                                            completeTrip(trip.id)
                                                        }
                                                        title="Complete Trip"
                                                    >
                                                        <CheckCircle2 size={15} />
                                                        Complete
                                                    </button>
                                                )}

                                                {trip.status === "Completed" && (
                                                    <span className="completed-text">
                                                        <CheckCircle2 size={15} />
                                                        Finished
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredTrips.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-table"
                                        >
                                            No trips found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <div>
                                <h2>Create New Trip</h2>
                                <p>
                                    Assign an available vehicle and driver.
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

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <label>
                                    Trip Name
                                    <input
                                        name="trip_name"
                                        value={form.trip_name}
                                        onChange={handleChange}
                                        placeholder="Pune to Mumbai Delivery"
                                        required
                                    />
                                </label>

                                <label>
                                    Origin
                                    <input
                                        name="origin"
                                        value={form.origin}
                                        onChange={handleChange}
                                        placeholder="Pune"
                                        required
                                    />
                                </label>

                                <label>
                                    Destination
                                    <input
                                        name="destination"
                                        value={form.destination}
                                        onChange={handleChange}
                                        placeholder="Mumbai"
                                        required
                                    />
                                </label>

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

                                        {vehicles
                                            .filter(
                                                (vehicle) =>
                                                    vehicle.status ===
                                                    "Available"
                                            )
                                            .map((vehicle) => (
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

                                <label>
                                    Driver
                                    <select
                                        name="driver_id"
                                        value={form.driver_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select driver
                                        </option>

                                        {drivers
                                            .filter(
                                                (driver) =>
                                                    driver.status ===
                                                    "Available"
                                            )
                                            .map((driver) => (
                                                <option
                                                    key={driver.id}
                                                    value={driver.id}
                                                >
                                                    {driver.name}
                                                </option>
                                            ))}
                                    </select>
                                </label>

                                <label>
                                    Scheduled Start
                                    <input
                                        type="datetime-local"
                                        name="scheduled_start"
                                        value={form.scheduled_start}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Scheduled End
                                    <input
                                        type="datetime-local"
                                        name="scheduled_end"
                                        value={form.scheduled_end}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Distance (km)
                                    <input
                                        type="number"
                                        min="0"
                                        name="distance"
                                        value={form.distance}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Cargo Weight
                                    <input
                                        type="number"
                                        min="0"
                                        name="cargo_weight"
                                        value={form.cargo_weight}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="full-width-field">
                                    Cargo Description
                                    <input
                                        name="cargo_description"
                                        value={form.cargo_description}
                                        onChange={handleChange}
                                        placeholder="Describe the cargo"
                                    />
                                </label>
                            </div>

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
                                    Create Trip
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Trips;