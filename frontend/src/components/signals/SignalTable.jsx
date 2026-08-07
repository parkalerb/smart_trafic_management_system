function SignalTable({ signals }) {
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
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Location</th>
                        <th style={{ padding: "12px" }}>Status</th>
                        <th style={{ padding: "12px" }}>Green</th>
                        <th style={{ padding: "12px" }}>Yellow</th>
                        <th style={{ padding: "12px" }}>Red</th>
                    </tr>
                </thead>

                <tbody>

                    {signals.map((signal) => (

                        <tr key={signal.id}>
                            <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {signal.id}
                            </td>

                            <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {signal.location}
                            </td>

                            <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {signal.status}
                            </td>

                            <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {signal.green_time}
                            </td>

                            <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {signal.yellow_time}
                            </td>

                            <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {signal.red_time}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default SignalTable;