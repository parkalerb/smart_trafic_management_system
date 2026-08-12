import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import UserFormModal from "../components/users/UserFormModal";
import UserDeleteModal from "../components/users/UserDeleteModal";
import { getUsers, updateUser, deleteUser } from "../services/userService";

function Users() {
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

    const handleOpenEditModal = (user) => {
        setEditingUser(user);
        setApiError(null);
        setIsFormOpen(true);
    };

    const handleOpenDeleteModal = (user) => {
        setDeletingUser(user);
        setApiError(null);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        if (!editingUser) return;

        setActionLoading(true);
        setApiError(null);
        try {
            await updateUser(editingUser.id, formData);
            showToast(`User account "${formData.full_name}" updated successfully!`);
            setIsFormOpen(false);
            setEditingUser(null);
            await loadUsers();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to update user account.";
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
                <h2>User Management</h2>
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
                <h3>System Users</h3>

                {loadingUsers ? (
                    <p style={{ textAlign: "center", padding: "20px" }}>Loading users...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={{ background: "#1976d2", color: "white" }}>
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
                                        No matching users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td style={styles.td}>{u.id}</td>
                                        <td style={{ ...styles.td, fontWeight: "600" }}>
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
                                                    background: u.is_active
                                                        ? "#e8f5e9"
                                                        : "#ffebee",
                                                    color: u.is_active
                                                        ? "#2e7d32"
                                                        : "#c62828"
                                                }}
                                            >
                                                {u.is_active ? "ACTIVE" : "INACTIVE"}
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
                )}
            </div>

            {/* Edit User Modal */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingUser}
                isEditing={true}
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
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "20px"
    },
    filterRow: {
        display: "flex",
        gap: "16px",
        marginTop: "24px",
        marginBottom: "20px"
    },
    searchInput: {
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        minWidth: "260px"
    },
    roleSelect: {
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        background: "#fff"
    },
    tableCard: {
        marginTop: "20px",
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "16px"
    },
    th: {
        padding: "12px",
        textAlign: "left"
    },
    thCenter: {
        padding: "12px",
        textAlign: "center"
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #ddd"
    },
    tdCenter: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
        textAlign: "center"
    },
    emptyTd: {
        padding: "20px",
        textAlign: "center",
        color: "#888"
    },
    roleBadge: {
        padding: "4px 8px",
        borderRadius: "4px",
        background: "#e3f2fd",
        color: "#1565c0",
        fontWeight: "bold",
        fontSize: "12px"
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold"
    },
    editBtn: {
        padding: "6px 12px",
        marginRight: "8px",
        background: "#ffa726",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "13px"
    },
    deleteBtn: {
        padding: "6px 12px",
        background: "#ef5350",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "13px"
    }
};

export default Users;
