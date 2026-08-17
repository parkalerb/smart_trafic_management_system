import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav
            style={{
                background: "#1565c0",
                color: "#ffffff",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                flexWrap: "wrap",
                gap: "12px"
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.4)",
                            color: "#ffffff",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                )}

                <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "0.3px" }}>
                    🚦 Smart Traffic Management System
                </div>
            </div>

            {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>
                        👤 <strong>{user.full_name || user.email}</strong>{" "}
                        <span
                            style={{
                                background: "rgba(255, 255, 255, 0.25)",
                                padding: "3px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                marginLeft: "4px"
                            }}
                        >
                            {user.role || "ADMIN"}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#c62828",
                            color: "#ffffff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#b71c1c")}
                        onMouseLeave={(e) => (e.target.style.background = "#c62828")}
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;