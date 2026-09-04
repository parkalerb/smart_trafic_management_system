import api from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
};

export const getDashboardAnalytics = async () => {
    const response = await api.get("/dashboard/analytics");
    return response.data;
};

export const getTrafficHistory = async (params = {}) => {
    const response = await api.get("/analytics/traffic-history", { params });
    return response.data;
};

export const getTrafficSummary = async () => {
    const response = await api.get("/analytics/traffic-summary");
    return response.data;
};