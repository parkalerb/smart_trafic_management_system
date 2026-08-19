import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import { getSignals } from "../services/signalService";
import { processDetection, getDetectionStatus } from "../services/detectionService";

import { useAuth } from "../context/AuthContext";

function Detection() {
    const { user } = useAuth();
    const userRole = user?.role || "USER";
    const canRunDetection = userRole === "ADMIN" || userRole === "OPERATOR";

    const [signals, setSignals] = useState([]);
    const [selectedSignalId, setSelectedSignalId] = useState("");
    const [detectionData, setDetectionData] = useState(null);

    const [loadingSignals, setLoadingSignals] = useState(false);
    const [processingDetection, setProcessingDetection] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);


    useEffect(() => {
        loadSignalsList();
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const loadSignalsList = async () => {
        setLoadingSignals(true);
        setApiError(null);
        try {
            const data = await getSignals();
            const signalList = Array.isArray(data) ? data : [];
            setSignals(signalList);
            if (signalList.length > 0) {
                setSelectedSignalId(signalList[0].id);
                fetchStatusForSignal(signalList[0].id);
            }
        } catch (err) {
            console.error("Failed to load traffic signals:", err);
            setApiError("Failed to fetch traffic signals for detection.");
        } finally {
            setLoadingSignals(false);
        }
    };

    const fetchStatusForSignal = async (signalId) => {
        if (!signalId) return;
        setApiError(null);
        try {
            const res = await getDetectionStatus(signalId);
            if (res.success && res.data) {
                setDetectionData(res.data);
            }
        } catch (err) {
            console.error("Failed to load detection status:", err);
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch camera detection status.";
            setApiError(msg);
        }
    };

    const handleSignalChange = (e) => {
        const signalId = e.target.value;
        setSelectedSignalId(signalId);
        if (signalId) {
            fetchStatusForSignal(signalId);
        } else {
            setDetectionData(null);
        }
    };

    const handleRunDetection = async () => {
        if (!selectedSignalId) {
            setApiError("Please select a valid traffic signal intersection first.");
            return;
        }

        setProcessingDetection(true);
        setApiError(null);

        try {
            const res = await processDetection(selectedSignalId, true);
            if (res.success && res.data) {
                setDetectionData(res.data);
                showToast(
                    `OpenCV detection completed! Detected ${res.data.vehicle_count} vehicles at "${res.data.location}".`
                );
            } else {
                setApiError(res.message || "Vehicle detection failed.");
            }
        } catch (err) {
            console.error("OpenCV Vehicle detection failed:", err);
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Camera / Detection server failure. Please check connection.";
            setApiError(msg);
        } finally {
            setProcessingDetection(false);
        }
    };

    const getCongestionBadgeStyle = (level) => {
        switch (level) {
            case "LOW":
                return { background: "#e8f5e9", color: "#2e7d32" };
            case "MEDIUM":
                return { background: "#fff3e0", color: "#ef6c00" };
            case "HIGH":
                return { background: "#ffebee", color: "#c62828" };
            default:
                return { background: "#e0e0e0", color: "#424242" };
        }
    };

    return (
        <Layout>
            <div style={styles.headerRow}>
                <div>
                    <h2 style={{ margin: "0 0 4px 0" }}>🎥 Live Vehicle Detection & Monitoring</h2>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                        Real-time Computer Vision contour analysis and dynamic signal timing optimization
                    </p>
                </div>

                {canRunDetection ? (
                    <button
                        onClick={handleRunDetection}
                        style={styles.runBtn}
                        disabled={processingDetection || !selectedSignalId}
                    >
                        {processingDetection ? "Processing OpenCV Frame..." : "⚡ Run OpenCV Detection"}
                    </button>
                ) : (
                    <span
                        style={{
                            background: "#e2e8f0",
                            color: "#475569",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "13px"
                        }}
                    >
                        👁️ View Only Mode
                    </span>
                )}
            </div>


            {/* Notification Messages */}
            {toastMessage && <div style={styles.toast}>✅ {toastMessage}</div>}
            {apiError && <div style={styles.errorAlert}>⚠️ {apiError}</div>}

            {/* Intersection Control Selector */}
            <div style={styles.controlCard}>
                <label style={styles.selectLabel}>Select Intersection Camera *</label>
                {loadingSignals ? (
                    <p style={{ margin: 0, color: "#666" }}>Loading signal cameras...</p>
                ) : signals.length === 0 ? (
                    <p style={{ margin: 0, color: "#d32f2f" }}>
                        No traffic signals found. Please add a signal on the Dashboard first.
                    </p>
                ) : (
                    <select
                        value={selectedSignalId}
                        onChange={handleSignalChange}
                        style={styles.select}
                        disabled={processingDetection}
                    >
                        {signals.map((s) => (
                            <option key={s.id} value={s.id}>
                                🚦 Signal #{s.id} - {s.location} ({s.status})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Detection Summary KPI Cards */}
            {detectionData && (
                <div style={styles.statsRow}>
                    <DashboardCard
                        title="Camera Status"
                        value={
                            <span
                                style={{
                                    ...styles.statusBadge,
                                    background:
                                        detectionData.camera_status === "ONLINE"
                                            ? "#e8f5e9"
                                            : "#ffebee",
                                    color:
                                        detectionData.camera_status === "ONLINE"
                                            ? "#2e7d32"
                                            : "#c62828"
                                }}
                            >
                                {detectionData.camera_status}
                            </span>
                        }
                    />

                    <DashboardCard
                        title="Detected Vehicles"
                        value={detectionData.vehicle_count}
                    />

                    <DashboardCard
                        title="Congestion Level"
                        value={
                            <span
                                style={{
                                    ...styles.statusBadge,
                                    ...getCongestionBadgeStyle(detectionData.congestion_level)
                                }}
                            >
                                {detectionData.congestion_level}
                            </span>
                        }
                    />

                    <DashboardCard
                        title="Optimized Green Time"
                        value={`${detectionData.calculated_green_time}s`}
                    />
                </div>
            )}

            {/* OpenCV Detection Feed & Timing Analysis Viewport */}
            {detectionData && (
                <div style={styles.viewportGrid}>
                    {/* Camera Feed Simulator */}
                    <div style={styles.viewportCard}>
                        <h4 style={styles.cardTitle}>📹 Live OpenCV Camera Feed Viewport</h4>
                        <div style={styles.cameraFrame}>
                            <div style={styles.cameraOverlayHeader}>
                                <span>CAM-ID: #{detectionData.signal_id}</span>
                                <span>REC 🔴 LIVE</span>
                            </div>

                            <div style={styles.cameraViewportContent}>
                                <div style={styles.detectionBoxPlaceholder}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }}>
                                        🚗 Vehicles Detected: {detectionData.vehicle_count}
                                    </p>
                                    <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                                        OpenCV Gaussian Blur & Contour Area Analysis Active
                                    </p>
                                </div>
                            </div>

                            <div style={styles.cameraOverlayFooter}>
                                <span>Location: {detectionData.location}</span>
                                <span>Fps: 30 FPS</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Timing Calculation Panel */}
                    <div style={styles.timingCard}>
                        <h4 style={styles.cardTitle}>⏱️ Dynamic Timing Optimization</h4>

                        <div style={styles.timingItem}>
                            <span style={styles.timingLabel}>Base Green Time</span>
                            <span style={styles.timingVal}>20 seconds</span>
                        </div>

                        <div style={styles.timingItem}>
                            <span style={styles.timingLabel}>Vehicle Factor (+3s per vehicle)</span>
                            <span style={styles.timingVal}>+{detectionData.vehicle_count * 3} seconds</span>
                        </div>

                        <hr style={{ borderColor: "#eee", margin: "12px 0" }} />

                        <div style={styles.timingItemHighlight}>
                            <span>Calculated Green Signal Time</span>
                            <span style={{ fontSize: "20px", color: "#2e7d32" }}>
                                {detectionData.calculated_green_time} sec
                            </span>
                        </div>

                        <div style={styles.timingItem}>
                            <span style={styles.timingLabel}>Yellow Signal Time</span>
                            <span style={styles.timingVal}>{detectionData.yellow_time} sec</span>
                        </div>

                        <div style={styles.timingItem}>
                            <span style={styles.timingLabel}>Red Signal Time</span>
                            <span style={styles.timingVal}>{detectionData.red_time} sec</span>
                        </div>

                        <div style={styles.infoNote}>
                            ℹ️ Dynamic Green Time is updated in MySQL database and synchronized with live traffic signal controllers.
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

const styles = {
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
    },
    runBtn: {
        background: "#1976d2",
        color: "#ffffff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    },
    toast: {
        background: "#e8f5e9",
        color: "#1b5e20",
        border: "1px solid #a5d6a7",
        padding: "12px 16px",
        borderRadius: "8px",
        marginTop: "16px",
        fontWeight: "600"
    },
    errorAlert: {
        background: "#ffebee",
        color: "#c62828",
        border: "1px solid #ef9a9a",
        padding: "12px 16px",
        borderRadius: "8px",
        marginTop: "16px",
        fontWeight: "600"
    },
    controlCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "20px"
    },
    selectLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        display: "block",
        marginBottom: "8px"
    },
    select: {
        width: "100%",
        maxWidth: "500px",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        outline: "none",
        background: "#fff"
    },
    statsRow: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "20px"
    },
    statusBadge: {
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "bold"
    },
    viewportGrid: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "24px"
    },
    viewportCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 2,
        minWidth: "320px"
    },
    timingCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1,
        minWidth: "280px"
    },
    cardTitle: {
        margin: "0 0 16px 0",
        color: "#263238",
        fontSize: "16px",
        fontWeight: "bold"
    },
    cameraFrame: {
        background: "#1c2526",
        borderRadius: "8px",
        overflow: "hidden",
        color: "#ffffff"
    },
    cameraOverlayHeader: {
        background: "rgba(0,0,0,0.6)",
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        fontWeight: "bold"
    },
    cameraViewportContent: {
        height: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, #2c3e50 0%, #000000 100%)"
    },
    detectionBoxPlaceholder: {
        border: "2px dashed #4caf50",
        padding: "24px 32px",
        borderRadius: "8px",
        textAlign: "center",
        background: "rgba(76, 175, 80, 0.1)"
    },
    cameraOverlayFooter: {
        background: "rgba(0,0,0,0.6)",
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px"
    },
    timingItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        fontSize: "14px",
        color: "#555"
    },
    timingLabel: {
        fontWeight: "500"
    },
    timingVal: {
        fontWeight: "bold",
        color: "#333"
    },
    timingItemHighlight: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        fontWeight: "bold",
        fontSize: "15px",
        color: "#1976d2"
    },
    infoNote: {
        background: "#e3f2fd",
        color: "#1565c0",
        padding: "10px 14px",
        borderRadius: "6px",
        fontSize: "12px",
        marginTop: "16px",
        lineHeight: "1.4"
    }
};

export default Detection;
