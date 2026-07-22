import API from "../api/axios";

// Get all assets
export const getAssets = () => API.get("/assets");

// Get asset by id
export const getAssetById = (id) =>
    API.get(`/assets/${id}`);
export const getAssetHistory = (id) =>
  api.get(`/assets/${id}/history`);

export const getAssetByCode = (assetCode) =>
    API.get(`/assets/code/${assetCode}`);
// Create asset
export const createAsset = (data) =>
    API.post("/assets", data);

// Update asset
export const updateAsset = (id, data) =>
    API.put(`/assets/${id}`, data);

// Delete asset
export const deleteAsset = (id) =>
    API.delete(`/assets/${id}`);

// Upload Excel
export const uploadAssetExcel = (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return API.post(
        "/assets/import",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

};