import API from "../api/axios";

export const getDepartments = () =>
  API.get("/departments");

export const createDepartment = (data) =>
  API.post("/departments", data);

export const updateDepartment = (id, data) =>
  API.put(`/departments/${id}`, data);

export const deleteDepartment = (id) =>
  API.delete(`/departments/${id}`);