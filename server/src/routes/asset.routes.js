const express = require("express");

const router = express.Router();

const assetController = require("../controllers/asset.controller");
const assetImportController = require("../controllers/assetImport.controller");
const upload = require("../middleware/upload.middleware");

// Import Excel
router.post(
    "/import",
    upload.single("file"),
    assetImportController.importAssets
);

// CRUD
router.post("/", assetController.createAsset);

router.get("/", assetController.getAllAssets);
router.get("/code/:assetCode", assetController.getAssetByCode);
router.get("/:id/history", assetController.getAssetHistory);

router.get("/:id", assetController.getAssetById);

router.put("/:id", assetController.updateAsset);

router.delete("/:id", assetController.deleteAsset);

module.exports = router;