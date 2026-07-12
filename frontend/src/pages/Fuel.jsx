import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    RefreshCw,
    X,
    Fuel as FuelIcon,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
    vehicle_id: "",
    trip_id: "",
    fuel_station: "",
    litres: "",
    price_per_litre: "",
    odometer_reading: "",
};

function Fuel() {
    const [fuelLogs, setFuelLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);

    const loadFuelLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get("/fuel");
            setFuelLogs(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load fuel logs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFuelLogs();
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
            await api.post("/fuel", {
                vehicle_id: Number(form.vehicle_id),
                trip_id: form.trip_id
                    ? Number(form.trip_id)
                    : null,
                fuel_station: form.fuel_station,
                litres: Number(form.litres),
                price_per_litre: Number(form.price_per_litre),
                odometer_reading: Number(
                    form.odometer_reading
                ),
            });

            setMessage("Fuel log added successfully.");
            setForm(initialForm);
            setShowModal(false);
            loadFuelLogs();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to add fuel log."
            );
        }
    };

    const filteredLogs = fuelLogs.filter((log) => {
        const text = search.toLowerCase();

        return (
            String(log.vehicle_id).includes(text) ||
            (log.fuel_station || "")
                .toLowerCase()
                .includes(text)
        );
    });

    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">FUEL MANAGEMENT</p>
                    <h1>Fuel Logs</h1>
                    <p>
                        Manage vehicle fuel records.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add Fuel Log
                </button>
            </div>

            {message && (
                <div className="alert-message">
                    {message}
                </div>
            )}

            <div className="content-card">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search fuel logs..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <button
                        className="secondary-button"
                        onClick={loadFuelLogs}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>
                {loading ? (
                    <div className="state-box">
                        <div className="spinner" />
                        <p>Loading fuel logs...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Fuel Station</th>
                                    <th>Litres</th>
                                    <th>Price/Litre</th>
                                    <th>Total Cost</th>
                                    <th>Odometer</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <div className="vehicle-cell">
                                                <div className="table-icon">
                                                    <FuelIcon size={18} />
                                                </div>
                                                <strong>
                                                    Vehicle #{log.vehicle_id}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            {log.fuel_station || "—"}
                                        </td>

                                        <td>{log.litres} L</td>

                                        <td>
                                            ₹{log.price_per_litre}
                                        </td>

                                        <td>
                                            <strong>
                                                ₹{Number(
                                                    log.total_cost
                                                ).toFixed(2)}
                                            </strong>
                                        </td>

                                        <td>
                                            {log.odometer_reading} km
                                        </td>

                                        <td>
                                            {new Date(
                                                log.fuel_date
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}

                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="empty-table"
                                        >
                                            No fuel logs found.
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
                                <h2>Add Fuel Log</h2>
                                <p>
                                    Enter fuel filling details.
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
                                    Vehicle ID
                                    <input
                                        type="number"
                                        name="vehicle_id"
                                        value={form.vehicle_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Trip ID
                                    <input
                                        type="number"
                                        name="trip_id"
                                        value={form.trip_id}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Fuel Station
                                    <input
                                        name="fuel_station"
                                        value={form.fuel_station}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Litres
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="litres"
                                        value={form.litres}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Price Per Litre
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price_per_litre"
                                        value={
                                            form.price_per_litre
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Odometer Reading
                                    <input
                                        type="number"
                                        name="odometer_reading"
                                        value={
                                            form.odometer_reading
                                        }
                                        onChange={handleChange}
                                        required
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
                                    Add Fuel Log
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Fuel;