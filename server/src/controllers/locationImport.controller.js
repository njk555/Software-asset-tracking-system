const fs = require("fs");

const {
    importLocations,
} = require("../services/locationImport.service");

const importLocationExcel = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "No File Uploaded",

            });

        }

        const result =
            await importLocations(req.file.path);

        fs.unlinkSync(req.file.path);

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message,

        });

    }

};

module.exports = {
    importLocationExcel,
};