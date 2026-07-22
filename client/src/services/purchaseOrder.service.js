import API from "../api/axios";

/*
=========================================
Get All Purchase Orders
=========================================
*/
export const getPurchaseOrders = async () => {
    const res = await API.get("/purchase-orders");
    return res.data.data;
};

/*
=========================================
Get Single Purchase Order
=========================================
*/
export const getPurchaseOrder = async (id) => {
    const res = await API.get(`/purchase-orders/${id}`);
    return res.data.data;
};

/*
=========================================
Create Purchase Order
=========================================
*/
export const createPurchaseOrder = async (data) => {
    const res = await API.post("/purchase-orders", data);
    return res.data;
};

/*
=========================================
Update Purchase Order
=========================================
*/
export const updatePurchaseOrder = async (id, data) => {
    const res = await API.put(`/purchase-orders/${id}`, data);
    return res.data;
};

/*
=========================================
Delete Purchase Order
=========================================
*/
export const deletePurchaseOrder = async (id) => {
    const res = await API.delete(`/purchase-orders/${id}`);
    return res.data;
};

/*
=========================================
Update Status
=========================================
*/
export const updatePurchaseOrderStatus = async (id, status) => {
    const res = await API.put(
        `/purchase-orders/${id}/status`,
        {
            status
        }
    );

    return res.data;
};

/*
=========================================
Download PDF
=========================================
*/
export const downloadPurchaseOrder = async (id) => {

    const res = await API.get(

        `/purchase-orders/${id}/pdf`,

        {
            responseType: "blob"
        }

    );

    return res.data;
};