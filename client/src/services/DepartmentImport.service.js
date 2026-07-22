import api from "../api/axios";

export const importDepartments = (file, onUploadProgress) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    "/departments/import",
    formData,
    {
      onUploadProgress,
    }
  );
};