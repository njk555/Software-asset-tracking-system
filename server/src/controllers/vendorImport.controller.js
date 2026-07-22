const vendorImportService = require("../services/vendorImport.service");

const importVendorExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No Excel file uploaded",
            });
        }

        const result = await vendorImportService.importVendors(req.file.path);

        return res.json({
            success: true,
            message: "Vendors imported successfully",
            ...result,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    importVendorExcel,
};