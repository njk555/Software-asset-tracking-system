import API from "../api/axios";

export const getInvoices = async () => (await API.get("/invoices")).data.data;
export const getInvoiceReminders = async () => (await API.get("/invoices/reminders")).data.data;
export const getInvoiceTaxRules = async () => (await API.get("/invoices/tax-rules")).data.data;
export const createInvoice = async (form, file) => {
  const data = new FormData();
  Object.entries(form).forEach(([key, value]) => data.append(key, value || ""));
  if (file) data.append("invoiceFile", file);
  return (await API.post("/invoices", data)).data.data;
};
export const markInvoicePaid = async (id) => (await API.patch(`/invoices/${id}/paid`)).data.data;
