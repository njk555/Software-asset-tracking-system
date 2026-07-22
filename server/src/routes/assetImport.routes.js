const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload.middleware");

const assetImportController = require("../controllers/assetImport.controller");

router.post(
    "/",
    upload.single("file"),
    assetImportController.importAssets
);

module.exports = router;