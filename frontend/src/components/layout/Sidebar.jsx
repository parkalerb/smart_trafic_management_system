import { NavLink } from "react-router-dom";

function Sidebar() {
    const linkStyle = ({ isActive }) => ({
        display: "block",
        padding: "10px 14px",
        color: isActive ? "#ffffff" : "#b0bec5",
        background: isActive ? "#1976d2" : "transparent",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "500",
        marginBottom: "6px"
    });

    return (
        <aside
            style={{
                width: "230px",
                background: "#263238",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            <h4 style={{ margin: "0 0 12px 0", color: "#eceff1" }}>Navigation Menu</h4>

            <hr style={{ borderColor: "#37474f", marginBottom: "16px" }} />

            <NavLink to="/" style={linkStyle}>
                📊 Dashboard
            </NavLink>

            <NavLink to="/users" style={linkStyle}>
                👤 Users
            </NavLink>
        </aside>
    );
}

export default Sidebar;