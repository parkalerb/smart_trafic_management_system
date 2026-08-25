import { useState, useEffect } from "react";

function UserFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isEditing = false,
    loading = false,
    apiError = null
}) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "USER",
        is_active: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData && isEditing) {
            setFormData({
                full_name: initialData.full_name || "",
                email: initialData.email || "",
                password: "",
                role: initialData.role || "USER",
                is_active: initialData.is_active ?? true
            });
        } else {
            setFormData({
                full_name: "",
                email: "",
                password: "",
                role: "USER",
                is_active: true
            });
        }
        setErrors({});
    }, [initialData, isEditing, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const errs = {};
        if (!formData.full_name.trim()) {
            errs.full_name = "Full name is required.";
        }
        if (!formData.email.trim()) {
            errs.email = "Email address is required.";
        }
        if (!isEditing && !formData.password) {
            errs.password = "Password is required.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            is_active: Boolean(formData.is_active)
        };

        if (!isEditing) {
            payload.password = formData.password;
        }

        onSubmit(payload);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={{ margin: 0, color: "#1e293b" }}>
                        {isEditing ? "Edit User Account" : "Add New User Account"}
                    </h3>
                    <button onClick={onClose} style={styles.closeBtn} disabled={loading}>
                        &times;
                    </button>
                </div>

                {apiError && <div style={styles.apiErrorAlert}>⚠️ {apiError}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name *</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            style={{
                                ...styles.input,
                                borderColor: errors.full_name ? "#d32f2f" : "#ccc"
                            }}
                            disabled={loading}
                        />
                        {errors.full_name && (
                            <span style={styles.errorText}>{errors.full_name}</span>
                        )}
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@traffic.com"
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? "#d32f2f" : "#ccc"
                            }}
                            disabled={loading}
                        />
                        {errors.email && (
                            <span style={styles.errorText}>{errors.email}</span>
                        )}
                    </div>

                    {!isEditing && (
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.password ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {errors.password && (
                                <span style={styles.errorText}>{errors.password}</span>
                            )}
                        </div>
                    )}

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={styles.select}
                            disabled={loading}
                        >
                            <option value="USER">USER</option>
                            <option value="OPERATOR">OPERATOR</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div style={styles.checkboxGroup}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            Account Active
                        </label>
                    </div>

                    <div style={styles.footer}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelBtn}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading
                                ? isEditing
                                    ? "Saving..."
                                    : "Creating..."
                                : isEditing
                                ? "Update User"
                                : "Create User"}
                        </button>
                    </div>
                </form>
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
        maxWidth: "460px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    closeBtn: {
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        color: "#666"
    },
    apiErrorAlert: {
        background: "#ffebee",
        color: "#c62828",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333"
    },
    input: {
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        outline: "none"
    },
    select: {
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        outline: "none",
        background: "#fff"
    },
    checkboxGroup: {
        display: "flex",
        alignItems: "center",
        marginTop: "4px"
    },
    checkboxLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer"
    },
    errorText: {
        color: "#d32f2f",
        fontSize: "12px"
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "12px"
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
    submitBtn: {
        padding: "10px 18px",
        borderRadius: "6px",
        border: "none",
        background: "#1976d2",
        color: "#ffffff",
        fontWeight: "600",
        cursor: "pointer"
    }
};

export default UserFormModal;
