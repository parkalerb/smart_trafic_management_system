import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    const linkStyle = ({ isActive }) => ({
        display: "block",
        padding: "10px 14px",
        color: isActive ? "#ffffff" : "#b0bec5",
        background: isActive ? "#1565c0" : "transparent",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "500",
        marginBottom: "6px",
        transition: "all 0.2s ease"
    });

    return (
        <aside
            style={{
                width: "230px",
                background: "#263238",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
                boxSizing: "border-box",
                flexShrink: 0,
                display: isOpen ? "block" : undefined
            }}
            className={isOpen ? "sidebar-open" : ""}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, color: "#eceff1", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Navigation Menu
                </h4>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#b0bec5",
                            fontSize: "18px",
                            cursor: "pointer",
                            display: "none"
                        }}
                        className="sidebar-close-btn"
                    >
                        ✕
                    </button>
                )}
            </div>

            <hr style={{ borderColor: "#37474f", marginBottom: "16px" }} />

            <NavLink to="/" style={linkStyle} onClick={onClose}>
                📊 Dashboard
            </NavLink>

            <NavLink to="/detection" style={linkStyle} onClick={onClose}>
                🎥 Detection
            </NavLink>

            <NavLink to="/users" style={linkStyle} onClick={onClose}>
                👤 Users
            </NavLink>
        </aside>
    );
}

export default Sidebar;