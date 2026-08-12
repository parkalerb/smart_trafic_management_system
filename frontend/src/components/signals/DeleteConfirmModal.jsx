function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    signalLocation,
    loading = false,
    apiError = null
}) {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={{ margin: "0 0 12px 0", color: "#d32f2f" }}>
                    🗑️ Delete Traffic Signal
                </h3>

                <p style={{ margin: "0 0 20px 0", color: "#555", lineHeight: "1.5" }}>
                    Are you sure you want to delete the traffic signal at{" "}
                    <strong>"{signalLocation}"</strong>? This action cannot be undone.
                </p>

                {apiError && (
                    <div style={styles.apiErrorAlert}>
                        ⚠️ {apiError}
                    </div>
                )}

                <div style={styles.footer}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={styles.cancelBtn}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        style={styles.deleteBtn}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Confirm Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    modal: {
        background: "#ffffff",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "420px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
    },
    apiErrorAlert: {
        background: "#ffebee",
        color: "#c62828",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px"
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px"
    },
    cancelBtn: {
        padding: "10px 18px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#f5f5f5",
        color: "#333",
        fontWeight: "600",
        cursor: "pointer"
    },
    deleteBtn: {
        padding: "10px 18px",
        borderRadius: "6px",
        border: "none",
        background: "#d32f2f",
        color: "#ffffff",
        fontWeight: "600",
        cursor: "pointer"
    }
};

export default DeleteConfirmModal;
