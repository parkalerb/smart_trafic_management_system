import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function CongestionDistributionChart({ summary }) {
    const low = summary?.low_congestion ?? 0;
    const medium = summary?.medium_congestion ?? 0;
    const high = summary?.high_congestion ?? 0;
    const total = low + medium + high;

    if (total === 0) {
        return (
            <div style={styles.card}>
                <h4 style={styles.title}>🚦 Congestion Distribution</h4>
                <p style={styles.emptyText}>No traffic detection history available yet.</p>
            </div>
        );
    }

    const data = {
        labels: ["LOW (<5)", "MEDIUM (5-12)", "HIGH (>12)"],
        datasets: [
            {
                data: [low, medium, high],
                backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
                borderColor: ["#ffffff", "#ffffff", "#ffffff"],
                borderWidth: 2,
                hoverOffset: 6
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: { size: 12, weight: "bold" },
                    padding: 14
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const count = context.raw || 0;
                        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                        return ` ${context.label}: ${count} Detections (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div style={styles.card}>
            <h4 style={styles.title}>🚦 Congestion Distribution</h4>
            <div style={styles.chartWrapper}>
                <Doughnut data={data} options={options} />
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
        flex: 1,
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    title: {
        margin: "0 0 16px 0",
        color: "#1e293b",
        fontSize: "16px",
        fontWeight: "bold",
        width: "100%",
        textAlign: "left"
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

export default CongestionDistributionChart;
