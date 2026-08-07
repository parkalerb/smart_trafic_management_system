import api from "./api";

export const getSignals = () => api.get("/signals");

export const getSignal = (id) => api.get(`/signals/${id}`);

export const createSignal = (data) =>
    api.post("/signals", data);

export const updateSignal = (id, data) =>
    api.put(`/signals/${id}`, data);

export const deleteSignal = (id) =>
    api.delete(`/signals/${id}`);

export const searchSignals = (location) =>
    api.get(`/signals/search?location=${location}`);

export const filterSignals = (status) =>
    api.get(`/signals/filter?status=${status}`);