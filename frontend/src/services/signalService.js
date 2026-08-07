import api from "./api";

export const getSignals = async () => {
    const response = await api.get("/signals");
    return response.data;
};