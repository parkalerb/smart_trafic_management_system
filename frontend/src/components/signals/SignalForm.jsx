import { useState, useEffect } from "react";

function SignalForm({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isEditing = false,
    loading = false,
    apiError = null
}) {
    const [formData, setFormData] = useState({
        location: "",
        green_time: 30,
        yellow_time: 5,
        red_time: 30,
        status: "ACTIVE"
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData && isEditing) {
            setFormData({
                location: initialData.location || "",
                green_time: initialData.green_time ?? 30,
                yellow_time: initialData.yellow_time ?? 5,
                red_time: initialData.red_time ?? 30,
                status: initialData.status || "ACTIVE"
            });
        } else {
            setFormData({
                location: "",
                green_time: 30,
                yellow_time: 5,
                red_time: 30,
                status: "ACTIVE"
            });
        }
        setErrors({});
    }, [initialData, isEditing, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};

        if (!formData.location.trim()) {
            newErrors.location = "Location is required.";
        }

        const green = parseInt(formData.green_time, 10);
        if (isNaN(green) || green <= 0) {
            newErrors.green_time = "Green time must be greater than 0.";
        }

        const yellow = parseInt(formData.yellow_time, 10);
        if (isNaN(yellow) || yellow <= 0) {
            newErrors.yellow_time = "Yellow time must be greater than 0.";
        }

        const red = parseInt(formData.red_time, 10);
        if (isNaN(red) || red <= 0) {
            newErrors.red_time = "Red time must be greater than 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            location: formData.location.trim(),
            green_time: parseInt(formData.green_time, 10),
            yellow_time: parseInt(formData.yellow_time, 10),
            red_time: parseInt(formData.red_time, 10),
            status: formData.status
        });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={{ margin: 0 }}>
                        {isEditing ? "Edit Traffic Signal" : "Add New Traffic Signal"}
                    </h3>
                    <button onClick={onClose} style={styles.closeBtn} disabled={loading}>
                        &times;
                    </button>
                </div>

                {apiError && (
                    <div style={styles.apiErrorAlert}>
                        ⚠️ {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. MG Road Junction"
                            style={{
                                ...styles.input,
                                borderColor: errors.location ? "#d32f2f" : "#ccc"
                            }}
                            disabled={loading}
                        />
                        {errors.location && <span style={styles.errorText}>{errors.location}</span>}
                    </div>

                    <div style={styles.row}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Green Time (sec) *</label>
                            <input
                                type="number"
                                name="green_time"
                                value={formData.green_time}
                                onChange={handleChange}
                                min="1"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.green_time ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {errors.green_time && <span style={styles.errorText}>{errors.green_time}</span>}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Yellow Time (sec) *</label>
                            <input
                                type="number"
                                name="yellow_time"
                                value={formData.yellow_time}
                                onChange={handleChange}
                                min="1"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.yellow_time ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {errors.yellow_time && <span style={styles.errorText}>{errors.yellow_time}</span>}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Red Time (sec) *</label>
                            <input
                                type="number"
                                name="red_time"
                                value={formData.red_time}
                                onChange={handleChange}
                                min="1"
                                style={{
                                    ...styles.input,
                                    borderColor: errors.red_time ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {errors.red_time && <span style={styles.errorText}>{errors.red_time}</span>}
                        </div>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={styles.select}
                            disabled={loading}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
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
                        <button
                            type="submit"
                            style={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading
                                ? isEditing ? "Saving..." : "Creating..."
                                : isEditing ? "Update Signal" : "Add Signal"}
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
        maxWidth: "500px",
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
        flex: 1,
        gap: "6px"
    },
    row: {
        display: "flex",
        gap: "12px"
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

export default SignalForm;
