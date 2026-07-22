import api from "../api/axios";

export const importCategories = async (file, onUploadProgress) => {

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        "/categories/import",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        }
    );

    return response.data;
};