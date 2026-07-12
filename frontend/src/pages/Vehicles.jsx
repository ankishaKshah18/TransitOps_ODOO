import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    RefreshCw,
    X,
    BusFront,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
    registration_number: "",
    name: "",
    vehicle_type: "",
    manufacturer: "",
    model: "",
    manufacturing_year: "",
    fuel_type: "Diesel",
    max_load_capacity: "",
    seating_capacity: "",
    odometer: "",
    acquisition_cost: "",
    status: "Available",
};

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get("/vehicles");
            setVehicles(response.data);
        } catch {
            setMessage("Unable to load vehicles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
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
            await api.post("/vehicles", {
                ...form,
                manufacturing_year: Number(form.manufacturing_year),
                max_load_capacity: Number(form.max_load_capacity),
                seating_capacity: Number(form.seating_capacity),
                odometer: Number(form.odometer || 0),
                acquisition_cost: Number(form.acquisition_cost || 0),
            });

            setShowModal(false);
            setForm(initialForm);
            setMessage("Vehicle added successfully.");
            loadVehicles();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to add vehicle."
            );
        }
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        const text = search.toLowerCase();

        return (
            vehicle.name?.toLowerCase().includes(text) ||
            vehicle.registration_number
                ?.toLowerCase()
                .includes(text) ||
            vehicle.vehicle_type?.toLowerCase().includes(text)
        );
    });

    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">FLEET MANAGEMENT</p>
                    <h1>Vehicles</h1>
                    <p>Manage and monitor your transport fleet.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add Vehicle
                </button>
            </div>

            {message && (
                <div className="alert-message">{message}</div>
            )}

            <div className="content-card">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        className="secondary-button"
                        onClick={loadVehicles}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="state-box">
                        <div className="spinner" />
                        <p>Loading vehicles...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Registration</th>
                                    <th>Type</th>
                                    <th>Fuel</th>
                                    <th>Odometer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                        <td>
                                            <div className="vehicle-cell">
                                                <div className="table-icon">
                                                    <BusFront size={18} />
                                                </div>

                                                <div>
                                                    <strong>{vehicle.name}</strong>
                                                    <span>
                                                        {vehicle.manufacturer}{" "}
                                                        {vehicle.model}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{vehicle.registration_number}</td>
                                        <td>{vehicle.vehicle_type}</td>
                                        <td>{vehicle.fuel_type}</td>
                                        <td>
                                            {vehicle.odometer?.toLocaleString()} km
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${vehicle.status
                                                    ?.toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {vehicle.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {filteredVehicles.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-table">
                                            No vehicles found.
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
                                <h2>Add Vehicle</h2>
                                <p>Add a new vehicle to your fleet.</p>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <label>
                                    Registration Number
                                    <input
                                        name="registration_number"
                                        value={form.registration_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Vehicle Name
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Vehicle Type
                                    <input
                                        name="vehicle_type"
                                        placeholder="Truck, Bus, Van..."
                                        value={form.vehicle_type}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Manufacturer
                                    <input
                                        name="manufacturer"
                                        value={form.manufacturer}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Model
                                    <input
                                        name="model"
                                        value={form.model}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Manufacturing Year
                                    <input
                                        type="number"
                                        name="manufacturing_year"
                                        value={form.manufacturing_year}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Fuel Type
                                    <select
                                        name="fuel_type"
                                        value={form.fuel_type}
                                        onChange={handleChange}
                                    >
                                        <option>Diesel</option>
                                        <option>Petrol</option>
                                        <option>Electric</option>
                                        <option>CNG</option>
                                    </select>
                                </label>

                                <label>
                                    Max Load Capacity
                                    <input
                                        type="number"
                                        name="max_load_capacity"
                                        value={form.max_load_capacity}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Seating Capacity
                                    <input
                                        type="number"
                                        name="seating_capacity"
                                        value={form.seating_capacity}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Odometer
                                    <input
                                        type="number"
                                        name="odometer"
                                        value={form.odometer}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Acquisition Cost
                                    <input
                                        type="number"
                                        name="acquisition_cost"
                                        value={form.acquisition_cost}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Status
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option>Available</option>
                                        <option>In Shop</option>
                                        <option>Retired</option>
                                    </select>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    Add Vehicle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Vehicles;