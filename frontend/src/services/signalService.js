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

export const createSignal = async (signalData) => {
    const response = await api.post("/signals", signalData);
    return response.data;
};

export const updateSignal = async (id, signalData) => {
    const response = await api.put(`/signals/${id}`, signalData);
    return response.data;
};

export const deleteSignal = async (id) => {
    const response = await api.delete(`/signals/${id}`);
    return response.data;
};