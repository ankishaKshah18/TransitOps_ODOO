import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    RefreshCw,
    X,
    UserRound,
    Phone,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
    name: "",
    phone: "",
    email: "",
    license_number: "",
    license_type: "",
    license_expiry: "",
    experience_years: "",
    status: "Available",
};

function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadDrivers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/drivers");
            setDrivers(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load drivers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDrivers();
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
            await api.post("/drivers", {
                ...form,
                experience_years: Number(form.experience_years || 0),
            });

            setForm(initialForm);
            setShowModal(false);
            setMessage("Driver added successfully.");
            loadDrivers();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to add driver."
            );
        }
    };

    const filteredDrivers = drivers.filter((driver) => {
        const text = search.toLowerCase();

        const matchesSearch =
            driver.name?.toLowerCase().includes(text) ||
            driver.email?.toLowerCase().includes(text) ||
            driver.phone?.toLowerCase().includes(text) ||
            driver.license_number?.toLowerCase().includes(text);

        const matchesStatus =
            statusFilter === "All" ||
            driver.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">WORKFORCE MANAGEMENT</p>
                    <h1>Drivers</h1>
                    <p>
                        Manage driver information, licences and availability.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add Driver
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
                            placeholder="Search drivers..."
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
                            <option value="Available">Available</option>
                            <option value="On Duty">On Duty</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <button
                            className="secondary-button"
                            onClick={loadDrivers}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="state-box">
                        <div className="spinner" />
                        <p>Loading drivers...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Driver</th>
                                    <th>Contact</th>
                                    <th>Licence</th>
                                    <th>Experience</th>
                                    <th>Licence Expiry</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDrivers.map((driver) => (
                                    <tr key={driver.id}>
                                        <td>
                                            <div className="vehicle-cell">
                                                <div className="table-icon">
                                                    <UserRound size={18} />
                                                </div>

                                                <div>
                                                    <strong>{driver.name}</strong>
                                                    <span>
                                                        {driver.email || "No email"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="contact-cell">
                                                <Phone size={14} />
                                                {driver.phone}
                                            </div>
                                        </td>

                                        <td>
                                            <strong>
                                                {driver.license_number}
                                            </strong>
                                            <div className="muted-text">
                                                {driver.license_type}
                                            </div>
                                        </td>

                                        <td>
                                            {driver.experience_years || 0} years
                                        </td>

                                        <td>
                                            {driver.license_expiry || "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${driver.status
                                                    ?.toLowerCase()
                                                    .replaceAll(" ", "-")}`}
                                            >
                                                {driver.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {filteredDrivers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-table"
                                        >
                                            No drivers found.
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
                                <h2>Add New Driver</h2>
                                <p>
                                    Enter the driver's personal and licence
                                    information.
                                </p>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <label>
                                    Full Name
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </label>

                                <label>
                                    Phone Number
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </label>

                                <label>
                                    Email Address
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="driver@example.com"
                                    />
                                </label>

                                <label>
                                    Licence Number
                                    <input
                                        name="license_number"
                                        value={form.license_number}
                                        onChange={handleChange}
                                        placeholder="Enter licence number"
                                        required
                                    />
                                </label>

                                <label>
                                    Licence Type
                                    <select
                                        name="license_type"
                                        value={form.license_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select licence type
                                        </option>
                                        <option value="LMV">LMV</option>
                                        <option value="HMV">HMV</option>
                                        <option value="Transport">
                                            Transport
                                        </option>
                                    </select>
                                </label>

                                <label>
                                    Licence Expiry
                                    <input
                                        type="date"
                                        name="license_expiry"
                                        value={form.license_expiry}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Experience (Years)
                                    <input
                                        type="number"
                                        min="0"
                                        name="experience_years"
                                        value={form.experience_years}
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
                                        <option value="Available">
                                            Available
                                        </option>
                                        <option value="On Duty">
                                            On Duty
                                        </option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
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
                                    <Plus size={17} />
                                    Add Driver
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Drivers;