import API from "../api/axios";

export const getPurchaseRequests = async () => (await API.get("/purchase-requests")).data.data;
export const getPurchaseRequestWorkflows = async () => (await API.get("/purchase-requests/workflows")).data.data;
export const createPurchaseRequestWorkflow = async (data) => (await API.post("/purchase-requests/workflows", data)).data.data;
export const createPurchaseRequest = async (form, files) => {
  const data = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    data.append(key, key === "items" ? JSON.stringify(value) : value || "");
  });
  files.forEach((file) => data.append("quotations", file));
  return (await API.post("/purchase-requests", data)).data.data;
};
export const actionPurchaseRequest = async (id, data) => (await API.patch(`/purchase-requests/${id}/action`, data)).data.data;
