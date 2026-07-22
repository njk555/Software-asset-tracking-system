import api from "../api/axios.js";
export const getTickets = () => api.get("/tickets");

export const getTicket = (id) => api.get(`/tickets/${id}`);

export const createTicket = (data) =>
  api.post("/tickets", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateTicket = (id, data) =>
  api.put(`/tickets/${id}`, data);

export const updateTicketStatus = (id, status) =>
  api.put(`/tickets/${id}/status`, { status });

export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`);

export const getTicketComments = (id) =>
  api.get(`/tickets/${id}/comments`);

export const addTicketComment = (id, data) =>
  api.post(`/tickets/${id}/comments`, data);