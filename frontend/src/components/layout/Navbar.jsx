import { Menu, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar({ setSidebarOpen }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <button
                className="menu-button"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={23} />
            </button>

            <div className="navbar-title">
                <h3>Transport Operations</h3>
                <p>Monitor and manage your fleet</p>
            </div>

            <div className="user-area">
                <div className="user-avatar">
                    <UserRound size={20} />
                </div>

                <div className="user-info">
                    <strong>{user?.name || "User"}</strong>
                    <span>{user?.role || "Fleet Manager"}</span>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <LogOut size={19} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;