import api from "./api";

export const registerUser = (data) =>
    api.post("/users/register", data);

export const loginUser = (data) =>
    api.post("/users/login", data);

export const getUsers = () =>
    api.get("/users");

export const getUser = (id) =>
    api.get(`/users/${id}`);

export const updateUser = (id, data) =>
    api.put(`/users/${id}`, data);

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);