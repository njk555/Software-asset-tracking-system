import api from "../api/axios";

export const importVendors = async (file, onUploadProgress) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/vendors/import",
        formData,
        {
            onUploadProgress,
        }
    );

    return response.data;
};