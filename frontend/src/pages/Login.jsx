import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/userService";

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Active tab: 'login' or 'register'
    const [activeTab, setActiveTab] = useState("login");

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    // Register Form State
    const [registerData, setRegisterData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "ADMIN"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // If user is already authenticated, redirect to Dashboard
    if (isAuthenticated) {
        navigate("/", { replace: true });
    }

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateLogin = () => {
        const errs = {};
        if (!loginData.email.trim()) {
            errs.email = "Email is required.";
        }
        if (!loginData.password) {
            errs.password = "Password is required.";
        }
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateRegister = () => {
        const errs = {};
        if (!registerData.full_name.trim()) {
            errs.full_name = "Full name is required.";
        }
        if (!registerData.email.trim()) {
            errs.email = "Email is required.";
        }
        if (!registerData.password) {
            errs.password = "Password is required.";
        }
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!validateLogin()) return;

        setLoading(true);
        try {
            const response = await loginUser(loginData);
            if (response.success && response.data) {
                login(response.data);
                navigate("/", { replace: true });
            } else {
                setError(response.message || "Invalid email or password.");
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to log in. Please check your credentials.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!validateRegister()) return;

        setLoading(true);
        try {
            const response = await registerUser(registerData);
            if (response.success && response.data) {
                setSuccessMsg("Registration successful! Logging you in...");
                setTimeout(() => {
                    login(response.data);
                    navigate("/", { replace: true });
                }, 1000);
            } else {
                setError(response.message || "Registration failed.");
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to register user. Email may already be in use.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.brandHeader}>
                    <h2 style={styles.title}>🚦 Smart Traffic Control</h2>
                    <p style={styles.subtitle}>Authentication Portal</p>
                </div>

                {/* Tab Switcher */}
                <div style={styles.tabContainer}>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("login");
                            setError(null);
                            setSuccessMsg(null);
                            setFieldErrors({});
                        }}
                        style={{
                            ...styles.tabBtn,
                            ...(activeTab === "login" ? styles.activeTab : {})
                        }}
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("register");
                            setError(null);
                            setSuccessMsg(null);
                            setFieldErrors({});
                        }}
                        style={{
                            ...styles.tabBtn,
                            ...(activeTab === "register" ? styles.activeTab : {})
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Notifications */}
                {error && <div style={styles.errorAlert}>⚠️ {error}</div>}
                {successMsg && <div style={styles.successAlert}>✅ {successMsg}</div>}

                {/* Login Form */}
                {activeTab === "login" && (
                    <form onSubmit={handleLoginSubmit} style={styles.form}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                placeholder="admin@traffic.com"
                                style={{
                                    ...styles.input,
                                    borderColor: fieldErrors.email ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {fieldErrors.email && (
                                <span style={styles.errorText}>{fieldErrors.email}</span>
                            )}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="••••••••"
                                style={{
                                    ...styles.input,
                                    borderColor: fieldErrors.password ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {fieldErrors.password && (
                                <span style={styles.errorText}>{fieldErrors.password}</span>
                            )}
                        </div>

                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                    <form onSubmit={handleRegisterSubmit} style={styles.form}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input
                                type="text"
                                name="full_name"
                                value={registerData.full_name}
                                onChange={handleRegisterChange}
                                placeholder="John Doe"
                                style={{
                                    ...styles.input,
                                    borderColor: fieldErrors.full_name ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {fieldErrors.full_name && (
                                <span style={styles.errorText}>{fieldErrors.full_name}</span>
                            )}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                placeholder="john@traffic.com"
                                style={{
                                    ...styles.input,
                                    borderColor: fieldErrors.email ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {fieldErrors.email && (
                                <span style={styles.errorText}>{fieldErrors.email}</span>
                            )}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                placeholder="••••••••"
                                style={{
                                    ...styles.input,
                                    borderColor: fieldErrors.password ? "#d32f2f" : "#ccc"
                                }}
                                disabled={loading}
                            />
                            {fieldErrors.password && (
                                <span style={styles.errorText}>{fieldErrors.password}</span>
                            )}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>System Role</label>
                            <select
                                name="role"
                                value={registerData.role}
                                onChange={handleRegisterChange}
                                style={styles.select}
                                disabled={loading}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="OPERATOR">OPERATOR</option>
                                <option value="USER">USER</option>
                            </select>
                        </div>

                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Registering..." : "Create Account"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f5f6fa",
        padding: "20px"
    },
    card: {
        background: "#ffffff",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "440px",
        padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    },
    brandHeader: {
        textAlign: "center",
        marginBottom: "24px"
    },
    title: {
        margin: "0 0 6px 0",
        color: "#1976d2",
        fontSize: "24px"
    },
    subtitle: {
        margin: 0,
        color: "#666",
        fontSize: "14px"
    },
    tabContainer: {
        display: "flex",
        borderBottom: "2px solid #e0e0e0",
        marginBottom: "24px"
    },
    tabBtn: {
        flex: 1,
        padding: "12px",
        background: "none",
        border: "none",
        fontSize: "15px",
        fontWeight: "600",
        color: "#666",
        cursor: "pointer",
        borderBottom: "2px solid transparent",
        marginBottom: "-2px"
    },
    activeTab: {
        color: "#1976d2",
        borderBottom: "2px solid #1976d2"
    },
    errorAlert: {
        background: "#ffebee",
        color: "#c62828",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px"
    },
    successAlert: {
        background: "#e8f5e9",
        color: "#1b5e20",
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
    errorText: {
        color: "#d32f2f",
        fontSize: "12px"
    },
    submitBtn: {
        padding: "12px",
        borderRadius: "6px",
        border: "none",
        background: "#1976d2",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
        marginTop: "8px"
    }
};

export default Login;
