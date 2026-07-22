const assetImportService = require("../services/assetImport.service");

exports.importAssets = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Excel file not uploaded",
            });
        }

        const result =
            await assetImportService.importExcel(
                req.file.path
            );

        return res.status(200).json({
            success: true,
            ...result,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};