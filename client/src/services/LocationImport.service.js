import api from "../api/axios";

export const importLocations = (file, onUploadProgress) => {

    const formData = new FormData();

    formData.append("file", file);

    return api.post(
        "/locations/import",
        formData,
        {
            onUploadProgress,
        }
    );
};