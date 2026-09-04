import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function VehicleTrendChart({ history }) {
    if (!history || history.length === 0) {
        return (
            <div style={styles.card}>
                <h4 style={styles.title}>📈 Vehicle Count Trend</h4>
                <p style={styles.emptyText}>No traffic detection history available yet.</p>
            </div>
        );
    }

    // Chronological order for trend
    const sorted = [...history].reverse();
    const labels = sorted.map((h) => {
        if (!h.detected_at) return "N/A";
        const date = new Date(h.detected_at);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    });
    const vehicleCounts = sorted.map((h) => h.vehicle_count);

    const data = {
        labels,
        datasets: [
            {
                label: "Vehicle Count",
                data: vehicleCounts,
                borderColor: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.15)",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: "#1976d2"
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 12, weight: "bold" }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` Vehicles: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Detected Vehicles",
                    font: { size: 12, weight: "bold" }
                }
            }
        }
    };

    return (
        <div style={styles.card}>
            <h4 style={styles.title}>📈 Vehicle Count Trend</h4>
            <div style={styles.chartWrapper}>
                <Line data={data} options={options} />
            </div>
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
        flex: 2,
        minWidth: "320px",
        display: "flex",
        flexDirection: "column"
    },
    title: {
        margin: "0 0 16px 0",
        color: "#1e293b",
        fontSize: "16px",
        fontWeight: "bold"
    },
    chartWrapper: {
        position: "relative",
        height: "260px",
        width: "100%"
    },
    emptyText: {
        color: "#64748b",
        fontSize: "14px",
        padding: "50px 0",
        textAlign: "center"
    }
};

export default VehicleTrendChart;
