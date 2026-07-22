const fs = require("fs");

const {
    importDepartments,
} = require("../services/departmentImport.service");

const importDepartmentExcel = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please upload an Excel file.",
            });

        }

        const result =
            await importDepartments(req.file.path);

        fs.unlinkSync(req.file.path);

        return res.json(result);

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,
            message: err.message,

        });

    }

};

module.exports = {
    importDepartmentExcel,
};