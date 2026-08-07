function Sidebar() {
    return (
        <aside
            style={{
                width: "230px",
                background: "#263238",
                color: "white",
                minHeight: "100vh",
                padding: "20px"
            }}
        >
            <h4>Menu</h4>

            <hr />

            <p>📊 Dashboard</p>

            <p>🚦 Signals</p>

            <p>👤 Users</p>

            <p>📈 Analytics</p>

            <p>⚙ Settings</p>
        </aside>
    );
}

export default Sidebar;