const fs = require("fs");

const {
    importCategories
} = require("../services/categoryImport.service");

const importCategoryExcel = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const result = await importCategories(req.file.path);

        fs.unlinkSync(req.file.path);

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    importCategoryExcel
};