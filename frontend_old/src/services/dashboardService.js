import api from "./api";

export const getDashboardStats = () =>
    api.get("/dashboard/stats");

export const getDashboardAnalytics = () =>
    api.get("/dashboard/analytics");