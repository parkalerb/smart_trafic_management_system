import axios from "axios";

// Environment-based API base URL with fallback to local development server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});

export default api;