import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function SignalStatusChart({ stats }) {
    const active = stats?.active_signals ?? 0;
    const inactive = stats?.inactive_signals ?? 0;
    const total = active + inactive;

    if (total === 0) {
        return (
            <div style={styles.card}>
                <h4 style={styles.title}>Signal Status Distribution</h4>
                <p style={styles.emptyText}>No signal data available</p>
            </div>
        );
    }

    const data = {
        labels: ["Active Signals", "Inactive Signals"],
        datasets: [
            {
                data: [active, inactive],
                backgroundColor: ["#2e7d32", "#ef5350"],
                borderColor: ["#ffffff", "#ffffff"],
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
                    font: {
                        size: 13,
                        weight: "bold"
                    },
                    padding: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const count = context.raw || 0;
                        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                        return ` ${context.label}: ${count} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div style={styles.card}>
            <h4 style={styles.title}>Signal Status Distribution</h4>
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1,
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    title: {
        margin: "0 0 16px 0",
        color: "#263238",
        fontSize: "16px",
        fontWeight: "bold",
        width: "100%",
        textAlign: "left"
    },
    chartWrapper: {
        position: "relative",
        height: "250px",
        width: "100%"
    },
    emptyText: {
        color: "#888",
        fontSize: "14px",
        padding: "40px 0"
    }
};

export default SignalStatusChart;
