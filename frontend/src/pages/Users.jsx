import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import UserFormModal from "../components/users/UserFormModal";
import UserDeleteModal from "../components/users/UserDeleteModal";
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function Users() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const [actionLoading, setActionLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Calculate Summary Stats
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.is_active).length;
    const inactiveUsers = users.filter((u) => !u.is_active).length;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;

    // Filter Users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setApiError(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (targetUser) => {
        setEditingUser(targetUser);
        setApiError(null);
        setIsFormOpen(true);
    };

    const handleOpenDeleteModal = (targetUser) => {
        setDeletingUser(targetUser);
        setApiError(null);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        setActionLoading(true);
        setApiError(null);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
                showToast(`User account "${formData.full_name}" updated successfully!`);
            } else {
                await createUser(formData);
                showToast(`User account "${formData.full_name}" created successfully!`);
            }
            setIsFormOpen(false);
            setEditingUser(null);
            await loadUsers();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to process user account.";
            setApiError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingUser) return;

        setActionLoading(true);
        setApiError(null);
        try {
            await deleteUser(deletingUser.id);
            showToast(`User account "${deletingUser.full_name}" deleted successfully!`);
            setIsDeleteOpen(false);
            setDeletingUser(null);
            await loadUsers();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to delete user account.";
            setApiError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Layout>
            <div style={styles.headerRow}>
                <h2 style={{ margin: 0, color: "#1e293b" }}>User Management Directory</h2>
                {isAdmin && (
                    <button onClick={handleOpenAddModal} style={styles.addBtn}>
                        ➕ Add User
                    </button>
                )}
            </div>

            {/* Success Toast Notification */}
            {toastMessage && <div style={styles.toast}>✅ {toastMessage}</div>}

            {/* Summary Cards */}
            <div style={styles.statsContainer}>
                <DashboardCard title="Total Users" value={totalUsers} />
                <DashboardCard title="Active Users" value={activeUsers} />
                <DashboardCard title="Inactive Users" value={inactiveUsers} />
                <DashboardCard title="Administrators" value={adminCount} />
            </div>

            {/* Filter Bar */}
            <div style={styles.filterRow}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={styles.roleSelect}
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="USER">USER</option>
                </select>
            </div>

            {/* User Table */}
            <div style={styles.tableCard}>
                <h3 style={{ margin: "0 0 16px 0", color: "#1e293b", fontSize: "18px", fontWeight: "bold" }}>
                    👤 System Users Directory
                </h3>

                {loadingUsers ? (
                    <p style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading users directory...</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ background: "#1565c0", color: "#ffffff" }}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Full Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.thCenter}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={styles.emptyTd}>
                                            No matching user accounts found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={styles.td}>#{u.id}</td>
                                            <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                                                {u.full_name}
                                            </td>
                                            <td style={styles.td}>{u.email}</td>
                                            <td style={styles.td}>
                                                <span style={styles.roleBadge}>{u.role}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        ...styles.statusBadge,
                                                        background: u.is_active ? "#e8f5e9" : "#ffebee",
                                                        color: u.is_active ? "#2e7d32" : "#c62828"
                                                    }}
                                                >
                                                    {u.is_active ? "🟢 ACTIVE" : "🔴 INACTIVE"}
                                                </span>
                                            </td>
                                            <td style={styles.tdCenter}>
                                                <button
                                                    onClick={() => handleOpenEditModal(u)}
                                                    style={styles.editBtn}
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    onClick={() => handleOpenDeleteModal(u)}
                                                    style={styles.deleteBtn}
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
                )}
            </div>

            {/* Edit / Add User Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingUser}
                isEditing={!!editingUser}
                loading={actionLoading}
                apiError={apiError}
            />

            {/* Delete User Modal */}
            <UserDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                userName={deletingUser?.full_name || ""}
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
        alignItems: "center"
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
        flex: "1 1 260px",
        outline: "none"
    },
    roleSelect: {
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
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "600px"
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
    td: {
        padding: "12px 14px",
        fontSize: "14px",
        color: "#334155"
    },
    tdCenter: {
        padding: "12px 14px",
        textAlign: "center"
    },
    emptyTd: {
        padding: "30px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "14px"
    },
    roleBadge: {
        padding: "3px 8px",
        borderRadius: "4px",
        background: "#e0f2fe",
        color: "#0369a1",
        fontWeight: "bold",
        fontSize: "11px"
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px"
    },
    editBtn: {
        padding: "6px 12px",
        marginRight: "8px",
        background: "#f57c00",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "12px"
    },
    deleteBtn: {
        padding: "6px 12px",
        background: "#c62828",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "12px"
    }
};

export default Users;
