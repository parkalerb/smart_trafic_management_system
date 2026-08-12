import api from "./api";

export const loginUser = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};
