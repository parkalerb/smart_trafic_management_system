import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav
            style={{
                background: "#1976d2",
                color: "white",
                padding: "12px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                🚦 Smart Traffic Management System
            </div>

            {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        👤 <strong>{user.full_name || user.email}</strong>{" "}
                        <span
                            style={{
                                background: "rgba(255, 255, 255, 0.2)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginLeft: "6px"
                            }}
                        >
                            {user.role || "ADMIN"}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#d32f2f",
                            color: "#ffffff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;