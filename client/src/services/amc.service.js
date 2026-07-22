import API from "../api/axios";
export const getAmcContracts = async () => (await API.get("/amc")).data.data;
export const createAmcContract = async (data) => (await API.post("/amc", data)).data.data;
export const completeAmcService = async (id, serviceDate) => (await API.patch(`/amc/${id}/complete-service`, { serviceDate })).data.data;
export const getAmcNotifications = async () => (await API.get("/amc/notifications")).data.data;
export const markAmcNotificationRead = async (id) => (await API.patch(`/amc/notifications/${id}/read`)).data.data;
