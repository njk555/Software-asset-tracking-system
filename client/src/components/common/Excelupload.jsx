import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { importAssets } from "../../services/assetImport.service";

export default function ExcelUpload({ onSuccess }) {

    const upload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const res = await importAssets(file);

            alert(
                `Imported : ${res.imported}\n\nSkipped : ${res.skipped}`
            );

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message || "Upload Failed"
            );

        }

    };

    return (
        <>
            <input
                hidden
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={upload}
            />

            <label htmlFor="excel-upload">
                <Button
                    component="span"
                    variant="contained"
                    color="success"
                    startIcon={<UploadFileIcon />}
                >
                    Upload Excel
                </Button>
            </label>
        </>
    );
}