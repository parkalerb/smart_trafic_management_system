import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import DashboardStats from "../components/dashboard/DashboardStats";
import AnalyticsCards from "../components/dashboard/AnalyticsCards";
import SignalStatusChart from "../components/dashboard/SignalStatusChart";
import SignalTimingChart from "../components/dashboard/SignalTimingChart";
import VehicleTrendChart from "../components/dashboard/VehicleTrendChart";
import CongestionDistributionChart from "../components/dashboard/CongestionDistributionChart";
import TrafficHistoryTable from "../components/dashboard/TrafficHistoryTable";
import TrafficSummaryCards from "../components/dashboard/TrafficSummaryCards";

import {
    getDashboardStats,
    getDashboardAnalytics,
    getTrafficHistory,
    getTrafficSummary
} from "../services/dashboardService";

import SignalTable from "../components/signals/SignalTable";
import SignalFilter from "../components/signals/SignalFilter";
import SignalForm from "../components/signals/SignalForm";
import DeleteConfirmModal from "../components/signals/DeleteConfirmModal";

import {
    getSignals,
    searchSignals,
    filterSignals,
    createSignal,
    updateSignal,
    deleteSignal
} from "../services/signalService";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();
    const userRole = user?.role || "USER";
    const canAddSignal = userRole === "ADMIN" || userRole === "OPERATOR";

    const [stats, setStats] = useState({
        total_signals: 0,
        active_signals: 0,
        inactive_signals: 0,
        total_users: 0
    });

    const [analytics, setAnalytics] = useState({
        total_green_time: 0,
        average_green_time: 0,
        maximum_green_time: 0,
        minimum_green_time: 0,
        active_percentage: 0,
        inactive_percentage: 0
    });

    const [trafficHistory, setTrafficHistory] = useState([]);
    const [trafficSummary, setTrafficSummary] = useState(null);

    const [signals, setSignals] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    // Modal & Action states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSignal, setEditingSignal] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingSignal, setDeletingSignal] = useState(null);

    const [actionLoading, setActionLoading] = useState(false);
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [analyticsError, setAnalyticsError] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        loadDashboard();
        loadSignals();
    }, []);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    async function loadDashboard() {
        setLoadingDashboard(true);
        setLoadingAnalytics(true);
        setAnalyticsError(null);

        try {
            const [statsData, analyticsData] = await Promise.all([
                getDashboardStats(),
                getDashboardAnalytics()
            ]);
            setStats(statsData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error("Failed to load dashboard metrics:", error);
        } finally {
            setLoadingDashboard(false);
        }

        try {
            const [historyRes, summaryRes] = await Promise.all([
                getTrafficHistory(),
                getTrafficSummary()
            ]);
            setTrafficHistory(historyRes.data || []);
            setTrafficSummary(summaryRes.data || null);
        } catch (error) {
            console.error("Failed to load traffic analytics:", error);
            setAnalyticsError(error);
        } finally {
            setLoadingAnalytics(false);
        }
    }

    async function loadSignals() {
        try {
            const data = await getSignals();
            setSignals(data);
        } catch (error) {
            console.error("Failed to load signals:", error);
        }
    }

    async function handleSearch() {
        try {
            if (search.trim() === "") {
                loadSignals();
                return;
            }
            const data = await searchSignals(search);
            setSignals(data);
        } catch (error) {
            console.error("Failed to search signals:", error);
        }
    }

    async function handleFilter(selectedStatus) {
        if (selectedStatus === "") {
            await loadSignals();
            return;
        }

        try {
            const data = await filterSignals(selectedStatus);
            setSignals(data);
        } catch (error) {
            console.error("Failed to filter signals:", error);
        }
    }

    // Modal Open Handlers
    const handleOpenAddModal = () => {
        setEditingSignal(null);
        setApiError(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (signal) => {
        setEditingSignal(signal);
        setApiError(null);
        setIsFormOpen(true);
    };

    const handleOpenDeleteModal = (signal) => {
        setDeletingSignal(signal);
        setApiError(null);
        setIsDeleteModalOpen(true);
    };

    // CRUD Handlers
    const handleFormSubmit = async (formData) => {
        setActionLoading(true);
        setApiError(null);

        try {
            if (editingSignal) {
                await updateSignal(editingSignal.id, formData);
                showToast(`Traffic signal at "${formData.location}" updated successfully!`);
            } else {
                await createSignal(formData);
                showToast(`Traffic signal at "${formData.location}" created successfully!`);
            }

            setIsFormOpen(false);
            setEditingSignal(null);
            await Promise.all([loadDashboard(), loadSignals()]);
        } catch (error) {
            console.error("Error saving traffic signal:", error);
            const msg =
                error.response?.data?.message ||
                error.message ||
                "Failed to save traffic signal. Please try again.";
            setApiError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingSignal) return;

        setActionLoading(true);
        setApiError(null);

        try {
            await deleteSignal(deletingSignal.id);
            showToast(`Traffic signal at "${deletingSignal.location}" deleted successfully!`);

            setIsDeleteModalOpen(false);
            setDeletingSignal(null);
            await Promise.all([loadDashboard(), loadSignals()]);
        } catch (error) {
            console.error("Error deleting traffic signal:", error);
            const msg =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete traffic signal. Please try again.";
            setApiError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Layout>
            {/* Header with Dashboard title & Add Signal button */}
            <div style={styles.headerRow}>
                <div>
                    <h2 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>Dashboard & Traffic Analytics</h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                        Real-time intersection monitoring, analytical metrics, and signal control
                    </p>
                </div>

                {canAddSignal && (
                    <button onClick={handleOpenAddModal} style={styles.addBtn}>
                        ➕ Add Traffic Signal
                    </button>
                )}
            </div>

            {/* Success Toast Banner */}
            {toastMessage && (
                <div style={styles.toast}>
                    ✅ {toastMessage}
                </div>
            )}

            {/* Overview KPI Cards */}
            <DashboardStats stats={stats} />

            {/* Analytical Metrics Cards */}
            <AnalyticsCards analytics={analytics} />

            {/* Visual Analytics Charts Section */}
            <div style={styles.chartsSection}>
                <h3 style={styles.sectionTitle}>📊 Traffic Signal Configuration & Status</h3>
                <div style={styles.chartsRow}>
                    <SignalStatusChart stats={stats} />
                    <SignalTimingChart signals={signals} />
                </div>
            </div>

            {/* Advanced Historical Traffic Analytics Section */}
            <div style={styles.chartsSection}>
                <h3 style={styles.sectionTitle}>📈 Advanced Historical Traffic Detection Analytics</h3>
                
                <TrafficSummaryCards summary={trafficSummary} />

                <div style={{ ...styles.chartsRow, marginTop: "16px" }}>
                    <VehicleTrendChart history={trafficHistory} />
                    <CongestionDistributionChart summary={trafficSummary} />
                </div>

                <TrafficHistoryTable
                    history={trafficHistory}
                    signals={signals}
                    loading={loadingAnalytics}
                    error={analyticsError}
                />
            </div>

            {/* Signals Table Section */}
            <div style={{ marginTop: "30px" }}>
                <SignalFilter
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />

                <SignalTable
                    signals={signals}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {/* Add / Edit Signal Modal */}
            <SignalForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingSignal}
                isEditing={!!editingSignal}
                loading={actionLoading}
                apiError={apiError}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                signalLocation={deletingSignal?.location || ""}
                loading={actionLoading}
                apiError={apiError}
            />
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
    addBtn: {
        background: "#2e7d32",
        color: "#ffffff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        transition: "background 0.2s ease"
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
    chartsSection: {
        marginTop: "30px"
    },
    sectionTitle: {
        margin: "0 0 16px 0",
        color: "#1e293b",
        fontSize: "18px",
        fontWeight: "bold"
    },
    chartsRow: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    }
};

export default Dashboard;