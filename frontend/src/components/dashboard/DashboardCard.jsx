function DashboardCard({ title, value }) {
    return (
        <div
            style={{
                background: "#ffffff",
                padding: "20px 24px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #edf2f7",
                flex: "1 1 200px",
                minWidth: "200px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box"
            }}
        >
            <h4 style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "14px", fontWeight: "600" }}>{title}</h4>

            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>{value}</div>
        </div>
    );
}

export default DashboardCard;