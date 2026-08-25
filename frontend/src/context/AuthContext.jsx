import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("authUser");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse saved user from localStorage:", error);
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            try {
                const response = await getCurrentUser();
                if (response && response.success && response.data) {
                    // Update user state and localStorage with canonical server-verified profile
                    setUser(response.data);
                    localStorage.setItem("authUser", JSON.stringify(response.data));
                } else {
                    setUser(null);
                    localStorage.removeItem("authUser");
                }
            } catch (error) {
                // If 401/403 or session invalid, clear stale local authentication state
                if (error.response?.status === 401 || error.response?.status === 403) {
                    setUser(null);
                    localStorage.removeItem("authUser");
                }
            } finally {
                setLoading(false);
            }
        };

        validateSession();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("authUser", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Logout API call failed:", e);
        } finally {
            setUser(null);
            localStorage.removeItem("authUser");
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    background: "#f5f6fa",
                    fontFamily: "sans-serif",
                    color: "#1976d2",
                    fontSize: "16px",
                    fontWeight: "600"
                }}
            >
                🚦 Validating session permissions...
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
