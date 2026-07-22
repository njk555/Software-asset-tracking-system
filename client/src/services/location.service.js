import API from "../api/axios";

export const getLocations = () =>
  API.get("/locations");

export const createLocation = (data) =>
  API.post("/locations", data);

export const updateLocation = (id, data) =>
  API.put(`/locations/${id}`, data);

export const deleteLocation = (id) =>
  API.delete(`/locations/${id}`);