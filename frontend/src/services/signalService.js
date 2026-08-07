import api from "./api";

export const getSignals = async () => {
    const response = await api.get("/signals");
    return response.data;
};

export const searchSignals = async (location) => {
    const response = await api.get(`/signals/search?location=${location}`);
    return response.data;
};

export const filterSignals = async (status) => {
    const response = await api.get(`/signals/filter?status=${status}`);
    return response.data;
};