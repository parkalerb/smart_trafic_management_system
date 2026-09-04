import { useState } from "react";

function TrafficHistoryTable({ history = [], signals = [], loading = false, error = null }) {
    const [selectedSignal, setSelectedSignal] = useState("");
    const [selectedCongestion, setSelectedCongestion] = useState("");

    const filteredHistory = history.filter((h) => {
        const matchesSignal = selectedSignal === "" || String(h.signal_id) === String(selectedSignal);
        const matchesCongestion = selectedCongestion === "" || h.congestion_level === selectedCongestion;
        return matchesSignal && matchesCongestion;
    });

    const getCongestionBadgeStyle = (level) => {
        switch (level) {
            case "LOW":
                return { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7" };
            case "MEDIUM":
                return { background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc80" };
            case "HIGH":
                return { background: "#ffebee", color: "#c62828", border: "1px solid #ef9a9a" };
            default:
                return { background: "#f1f5f9", color: "#475569" };
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.headerRow}>
                <h4 style={styles.title}>📜 Recent Detection History Log</h4>
                
                {/* Lightweight Filters */}
                <div style={styles.filterGroup}>
                    <select
                        value={selectedSignal}
                        onChange={(e) => setSelectedSignal(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">All Intersections</option>
                        {signals.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.location} (#{s.id})
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedCongestion}
                        onChange={(e) => setSelectedCongestion(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">All Congestion Levels</option>
                        <option value="LOW">LOW (&lt;5)</option>
                        <option value="MEDIUM">MEDIUM (5-12)</option>
                        <option value="HIGH">HIGH (&gt;12)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p style={styles.statusText}>⏳ Loading traffic analytics...</p>
            ) : error ? (
                <p style={styles.errorText}>⚠️ Unable to load traffic analytics.</p>
            ) : filteredHistory.length === 0 ? (
                <p style={styles.statusText}>No traffic detection history available yet.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={{ background: "#1e293b", color: "#ffffff" }}>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Intersection Location</th>
                                <th style={styles.thCenter}>Vehicle Count</th>
                                <th style={styles.thCenter}>Congestion</th>
                                <th style={styles.thCenter}>Green Time</th>
                                <th style={styles.thRight}>Detected At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredHistory.map((item) => (
                                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={styles.td}>#{item.id}</td>
                                    <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                                        {item.location}
                                    </td>
                                    <td style={styles.tdCenter}>
                                        <span style={styles.countBadge}>{item.vehicle_count} vehicles</span>
                                    </td>
                                    <td style={styles.tdCenter}>
                                        <span style={{ ...styles.badge, ...getCongestionBadgeStyle(item.congestion_level) }}>
                                            {item.congestion_level}
                                        </span>
                                    </td>
                                    <td style={styles.tdCenter}>
                                        <span style={styles.greenTimeBadge}>{item.green_time}s</span>
                                    </td>
                                    <td style={styles.tdRight}>
                                        {item.detected_at
                                            ? new Date(item.detected_at).toLocaleString()
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    card: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #edf2f7",
        marginTop: "24px"
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "16px"
    },
    title: {
        margin: 0,
        color: "#1e293b",
        fontSize: "16px",
        fontWeight: "bold"
    },
    filterGroup: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },
    select: {
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        fontSize: "13px",
        background: "#ffffff",
        outline: "none"
    },
    statusText: {
        color: "#64748b",
        fontSize: "14px",
        padding: "30px 0",
        textAlign: "center"
    },
    errorText: {
        color: "#c62828",
        fontSize: "14px",
        padding: "30px 0",
        textAlign: "center"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "650px"
    },
    th: {
        padding: "12px 14px",
        textAlign: "left",
        fontSize: "13px"
    },
    thCenter: {
        padding: "12px 14px",
        textAlign: "center",
        fontSize: "13px"
    },
    thRight: {
        padding: "12px 14px",
        textAlign: "right",
        fontSize: "13px"
    },
    td: {
        padding: "12px 14px",
        fontSize: "14px",
        color: "#334155"
    },
    tdCenter: {
        padding: "12px 14px",
        textAlign: "center"
    },
    tdRight: {
        padding: "12px 14px",
        textAlign: "right",
        fontSize: "13px",
        color: "#64748b"
    },
    countBadge: {
        background: "#e0f2fe",
        color: "#0369a1",
        padding: "4px 10px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "12px"
    },
    greenTimeBadge: {
        background: "#f0fdf4",
        color: "#15803d",
        padding: "4px 10px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "12px"
    },
    badge: {
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "inline-block"
    }
};

export default TrafficHistoryTable;
