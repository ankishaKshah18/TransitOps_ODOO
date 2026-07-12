import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BusFront,
    Users,
    Route,
    Wrench,
    Fuel,
    Receipt,
    BarChart3,
    X,
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Vehicles", path: "/vehicles", icon: BusFront },
    { name: "Drivers", path: "/drivers", icon: Users },
    { name: "Trips", path: "/trips", icon: Route },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Fuel", path: "/fuel", icon: Fuel },
    { name: "Expenses", path: "/expenses", icon: Receipt },
    { name: "Reports", path: "/reports", icon: BarChart3 },
];

function Sidebar({ open, setOpen }) {
    return (
        <>
            {open && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
                <div className="brand">
                    <div className="brand-icon">
                        <BusFront size={24} />
                    </div>

                    <div>
                        <h2>TransitOps</h2>
                        <span>Fleet Management</span>
                    </div>

                    <button
                        className="mobile-close"
                        onClick={() => setOpen(false)}
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">OPERATIONS</p>

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;