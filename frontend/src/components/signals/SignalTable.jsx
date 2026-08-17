function SignalTable({ signals, onEdit, onDelete }) {
    return (
        <div
            style={{
                marginTop: "30px",
                background: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #edf2f7"
            }}
        >
            <h3 style={{ margin: "0 0 16px 0", color: "#1e293b", fontSize: "18px", fontWeight: "bold" }}>
                🚦 Traffic Signals Directory
            </h3>

            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "650px"
                    }}
                >
                    <thead>
                        <tr style={{ background: "#1565c0", color: "#ffffff" }}>
                            <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "13px" }}>ID</th>
                            <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "13px" }}>Location</th>
                            <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "13px" }}>Status</th>
                            <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px" }}>Green (s)</th>
                            <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px" }}>Yellow (s)</th>
                            <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px" }}>Red (s)</th>
                            <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {signals.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    style={{
                                        padding: "30px 20px",
                                        textAlign: "center",
                                        color: "#64748b",
                                        fontSize: "14px"
                                    }}
                                >
                                    No traffic signals found matching your filter.
                                </td>
                            </tr>
                        ) : (
                            signals.map((signal) => (
                                <tr key={signal.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px 14px", fontSize: "14px", color: "#64748b" }}>
                                        #{signal.id}
                                    </td>

                                    <td style={{ padding: "12px 14px", fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>
                                        {signal.location}
                                    </td>

                                    <td style={{ padding: "12px 14px" }}>
                                        <span
                                            style={{
                                                padding: "4px 12px",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                background: signal.status === "ACTIVE" ? "#e8f5e9" : "#ffebee",
                                                color: signal.status === "ACTIVE" ? "#2e7d32" : "#c62828"
                                            }}
                                        >
                                            {signal.status === "ACTIVE" ? "🟢 ACTIVE" : "🔴 INACTIVE"}
                                        </span>
                                    </td>

                                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: "500" }}>
                                        {signal.green_time}s
                                    </td>

                                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: "500" }}>
                                        {signal.yellow_time}s
                                    </td>

                                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: "500" }}>
                                        {signal.red_time}s
                                    </td>

                                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                        <button
                                            onClick={() => onEdit(signal)}
                                            style={{
                                                padding: "6px 12px",
                                                marginRight: "8px",
                                                background: "#f57c00",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "12px"
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            onClick={() => onDelete(signal)}
                                            style={{
                                                padding: "6px 12px",
                                                background: "#c62828",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "12px"
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SignalTable;