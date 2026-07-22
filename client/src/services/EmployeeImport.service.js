import api from "../api/axios";

export const importEmployees = async (
    file,
    onUploadProgress
) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(

        "/employees/import",

        formData,

        {
            onUploadProgress,
        }

    );

    return response.data;

};