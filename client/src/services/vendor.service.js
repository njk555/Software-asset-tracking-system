import API from "../api/axios";

export const getVendors = async () => {
    const res = await API.get("/vendors");
    return res.data.data;
};

export const createVendor = async (data) => {
    const res = await API.post("/vendors", data);
    return res.data;
};

export const updateVendor = async (id, data) => {
    const res = await API.put(`/vendors/${id}`, data);
    return res.data;
};

export const deleteVendor = async (id) => {
    const res = await API.delete(`/vendors/${id}`);
    return res.data;
};

export const importVendors = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post("/vendors/import", formData, {
        onUploadProgress,
    });

    return res.data;
};