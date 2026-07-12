import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth(); // Assumes a register function exists in your AuthContext

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Adjust this execution statement to fit your actual context API signature
            await register(name.trim(), email.trim(), password);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create an account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const focusStyle = `
        input:focus {
            outline: none !important;
            border-color: #2563eb !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
        button:focus-visible {
            outline: 2px solid #2563eb !important;
            outline-offset: 2px !important;
        }
    `;

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                padding: "24px",
                fontFamily: "system-ui, -apple-system, sans-serif"
            }}
        >
            <style>{focusStyle}</style>

            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "40px 32px",
                    borderRadius: "16px",
                    background: "#ffffff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #f1f5f9"
                }}
            >
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        marginBottom: "16px"
                    }}>
                        <UserPlus size={24} />
                    </div>
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#0f172a",
                            margin: "0 0 6px 0",
                            letterSpacing: "-0.025em"
                        }}
                    >
                        Create Account
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#64748b",
                            fontWeight: "500"
                        }}
                    >
                        Join TransitOps Fleet Management
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#fef2f2",
                        border: "1px solid #fee2e2",
                        color: "#991b1b",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Full Name Input */}
                    <div style={{ marginBottom: "18px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#334155",
                            marginBottom: "6px"
                        }}>
                            Full Name
                        </label>
                        <div style={{ position: "relative" }}>
                            <User
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8",
                                    pointerEvents: "none"
                                }}
                            />
                            <input
                                autoFocus
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    height: "44px",
                                    padding: "0 14px 0 42px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "15px",
                                    color: "#0f172a",
                                    transition: "all 0.15s ease",
                                    background: "#ffffff"
                                }}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div style={{ marginBottom: "18px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#334155",
                            marginBottom: "6px"
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8",
                                    pointerEvents: "none"
                                }}
                            />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    height: "44px",
                                    padding: "0 14px 0 42px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "15px",
                                    color: "#0f172a",
                                    transition: "all 0.15s ease",
                                    background: "#ffffff"
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: "18px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#334155",
                            marginBottom: "6px"
                        }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <Lock
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8",
                                    pointerEvents: "none"
                                }}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    height: "44px",
                                    padding: "0 44px 0 42px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "15px",
                                    color: "#0f172a",
                                    transition: "all 0.15s ease",
                                    background: "#ffffff"
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "4px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "36px",
                                    height: "36px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "none",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    color: "#64748b",
                                    transition: "color 0.15s ease"
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div style={{ marginBottom: "28px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#334155",
                            marginBottom: "6px"
                        }}>
                            Confirm Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <Lock
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#94a3b8",
                                    pointerEvents: "none"
                                }}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    height: "44px",
                                    padding: "0 14px 0 42px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "15px",
                                    color: "#0f172a",
                                    transition: "all 0.15s ease",
                                    background: "#ffffff"
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            background: loading ? "#93c5fd" : "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.15s ease",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = "#1d4ed8";
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
                        }}
                    >
                        {loading ? (
                            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        ) : (
                            <UserPlus size={18} />
                        )}
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {/* Switch to Login */}
                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            fontWeight: "600",
                            cursor: "pointer",
                            padding: 0
                        }}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Register;