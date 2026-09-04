import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import { getAuditLogs } from "../services/userService";

function AuditLogs() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("ALL");

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAuditLogs();
            if (response && response.success && Array.isArray(response.data)) {
                setAuditLogs(response.data);
            } else {
                setAuditLogs([]);
            }
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
            setError("Unable to load activity logs.");
        } finally {
            setLoading(false);
        }
    };

    const getActionDisplay = (action) => {
        switch (action) {
            case "CREATE_USER":
                return { label: "Created User", style: { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7" } };
            case "CHANGE_ROLE":
                return { label: "Role Changed", style: { background: "#e0f2fe", color: "#0369a1", border: "1px solid #7dd3fc" } };
            case "ACTIVATE_USER":
                return { label: "Account Activated", style: { background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac" } };
            case "DEACTIVATE_USER":
                return { label: "Account Deactivated", style: { background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc80" } };
            case "DELETE_USER":
                return { label: "Deleted User", style: { background: "#ffebee", color: "#c62828", border: "1px solid #ef9a9a" } };
            case "UPDATE_USER":
            default:
                return { label: "Updated Profile", style: { background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" } };
        }
    };

    // Filter Logs
    const filteredLogs = auditLogs.filter((log) => {
        const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
        const searchLower = search.toLowerCase();
        const matchesSearch =
            search === "" ||
            log.actor_name?.toLowerCase().includes(searchLower) ||
            log.actor_email?.toLowerCase().includes(searchLower) ||
            log.target_name?.toLowerCase().includes(searchLower) ||
            log.target_email?.toLowerCase().includes(searchLower) ||
            log.details?.toLowerCase().includes(searchLower);
        return matchesAction && matchesSearch;
    });

    // Summary Stats
    const totalLogs = auditLogs.length;
    const createLogs = auditLogs.filter((l) => l.action === "CREATE_USER").length;
    const roleLogs = auditLogs.filter((l) => l.action === "CHANGE_ROLE").length;
    const deleteLogs = auditLogs.filter((l) => l.action === "DELETE_USER").length;

    return (
        <Layout>
            <div style={styles.headerRow}>
                <div>
                    <h2 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>User Activity & System Audit Logs</h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                        Complete immutable traceability for administrative user management actions
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={styles.statsContainer}>
                <DashboardCard title="Total Audit Logs" value={totalLogs} />
                <DashboardCard title="Users Created" value={createLogs} />
                <DashboardCard title="Role Changes" value={roleLogs} />
                <DashboardCard title="Account Deletions" value={deleteLogs} />
            </div>

            {/* Filter Bar */}
            <div style={styles.filterRow}>
                <input
                    type="text"
                    placeholder="Search by actor, target user, or details..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />

                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    style={styles.select}
                >
                    <option value="ALL">All Actions</option>
                    <option value="CREATE_USER">Created User</option>
                    <option value="CHANGE_ROLE">Role Changed</option>
                    <option value="ACTIVATE_USER">Account Activated</option>
                    <option value="DEACTIVATE_USER">Account Deactivated</option>
                    <option value="UPDATE_USER">Updated Profile</option>
                    <option value="DELETE_USER">Deleted User</option>
                </select>
            </div>

            {/* Audit Log Table */}
            <div style={styles.tableCard}>
                <h3 style={{ margin: "0 0 16px 0", color: "#1e293b", fontSize: "18px", fontWeight: "bold" }}>
                    📋 Activity Audit Trail
                </h3>

                {loading ? (
                    <p style={styles.statusText}>⏳ Loading activity logs...</p>
                ) : error ? (
                    <p style={styles.errorText}>⚠️ {error}</p>
                ) : filteredLogs.length === 0 ? (
                    <p style={styles.statusText}>No activity recorded yet.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ background: "#1e293b", color: "#ffffff" }}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Action</th>
                                    <th style={styles.th}>Performed By</th>
                                    <th style={styles.th}>Target User</th>
                                    <th style={styles.th}>Details</th>
                                    <th style={styles.thRight}>Date & Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLogs.map((log) => {
                                    const actionDisplay = getActionDisplay(log.action);
                                    return (
                                        <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={styles.td}>#{log.id}</td>
                                            <td style={styles.td}>
                                                <span style={{ ...styles.badge, ...actionDisplay.style }}>
                                                    {actionDisplay.label}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: "600", color: "#1e293b" }}>{log.actor_name}</div>
                                                <div style={styles.subText}>{log.actor_email}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: "600", color: "#1e293b" }}>{log.target_name}</div>
                                                <div style={styles.subText}>{log.target_email}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ color: "#334155" }}>{log.details}</span>
                                            </td>
                                            <td style={styles.tdRight}>
                                                {log.created_at
                                                    ? new Date(log.created_at).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

const styles = {
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    statsContainer: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        marginTop: "20px"
    },
    filterRow: {
        display: "flex",
        gap: "16px",
        marginTop: "24px",
        marginBottom: "20px",
        flexWrap: "wrap"
    },
    searchInput: {
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        flex: "1 1 300px",
        outline: "none"
    },
    select: {
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        background: "#ffffff",
        outline: "none"
    },
    tableCard: {
        marginTop: "20px",
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #edf2f7"
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
        minWidth: "750px"
    },
    th: {
        padding: "12px 14px",
        textAlign: "left",
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
    tdRight: {
        padding: "12px 14px",
        textAlign: "right",
        fontSize: "13px",
        color: "#64748b"
    },
    subText: {
        fontSize: "12px",
        color: "#64748b"
    },
    badge: {
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "inline-block"
    }
};

export default AuditLogs;
