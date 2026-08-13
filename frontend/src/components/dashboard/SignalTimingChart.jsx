import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SignalTimingChart({ signals }) {
    if (!signals || signals.length === 0) {
        return (
            <div style={styles.card}>
                <h4 style={styles.title}>Signal Cycle Timings by Intersection</h4>
                <p style={styles.emptyText}>No traffic signal data available</p>
            </div>
        );
    }

    const labels = signals.map((s) => s.location);
    const greenTimes = signals.map((s) => s.green_time);
    const yellowTimes = signals.map((s) => s.yellow_time);
    const redTimes = signals.map((s) => s.red_time);

    const data = {
        labels,
        datasets: [
            {
                label: "Green Time (sec)",
                data: greenTimes,
                backgroundColor: "#4caf50",
                borderRadius: 4
            },
            {
                label: "Yellow Time (sec)",
                data: yellowTimes,
                backgroundColor: "#ffb74d",
                borderRadius: 4
            },
            {
                label: "Red Time (sec)",
                data: redTimes,
                backgroundColor: "#ef5350",
                borderRadius: 4
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
                    font: {
                        size: 12,
                        weight: "bold"
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ${context.dataset.label}: ${context.raw} seconds`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Seconds",
                    font: {
                        size: 12,
                        weight: "bold"
                    }
                }
            }
        }
    };

    return (
        <div style={styles.card}>
            <h4 style={styles.title}>Signal Cycle Timings by Intersection</h4>
            <div style={styles.chartWrapper}>
                <Bar data={data} options={options} />
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
        flex: 2,
        minWidth: "320px",
        display: "flex",
        flexDirection: "column"
    },
    title: {
        margin: "0 0 16px 0",
        color: "#263238",
        fontSize: "16px",
        fontWeight: "bold"
    },
    chartWrapper: {
        position: "relative",
        height: "250px",
        width: "100%"
    },
    emptyText: {
        color: "#888",
        fontSize: "14px",
        padding: "40px 0",
        textAlign: "center"
    }
};

export default SignalTimingChart;
