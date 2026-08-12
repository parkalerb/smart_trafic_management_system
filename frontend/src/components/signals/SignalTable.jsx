function SignalTable({ signals, onEdit, onDelete }) {
    return (
        <div
            style={{
                marginTop: "30px",
                background: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
        >
            <h3>Traffic Signals</h3>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px"
                }}
            >
                <thead>
                    <tr style={{ background: "#1976d2", color: "white" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Location</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Green (s)</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Yellow (s)</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Red (s)</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {signals.length === 0 ? (
                        <tr>
                            <td
                                colSpan="7"
                                style={{
                                    padding: "20px",
                                    textAlign: "center",
                                    color: "#888"
                                }}
                            >
                                No traffic signals found.
                            </td>
                        </tr>
                    ) : (
                        signals.map((signal) => (
                            <tr key={signal.id}>
                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                    {signal.id}
                                </td>

                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd", fontWeight: "500" }}>
                                    {signal.location}
                                </td>

                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            background: signal.status === "ACTIVE" ? "#e8f5e9" : "#ffebee",
                                            color: signal.status === "ACTIVE" ? "#2e7d32" : "#c62828"
                                        }}
                                    >
                                        {signal.status}
                                    </span>
                                </td>

                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd", textAlign: "center" }}>
                                    {signal.green_time}
                                </td>

                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd", textAlign: "center" }}>
                                    {signal.yellow_time}
                                </td>

                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd", textAlign: "center" }}>
                                    {signal.red_time}
                                </td>

                                <td style={{ padding: "12px", borderBottom: "1px solid #ddd", textAlign: "center" }}>
                                    <button
                                        onClick={() => onEdit(signal)}
                                        style={{
                                            padding: "6px 12px",
                                            marginRight: "8px",
                                            background: "#ffa726",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            fontSize: "13px"
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(signal)}
                                        style={{
                                            padding: "6px 12px",
                                            background: "#ef5350",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            fontSize: "13px"
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
    );
}

export default SignalTable;