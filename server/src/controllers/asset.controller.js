const assetService = require("../services/asset.service");

// Create Asset
const createAsset = async (req, res) => {
    try {
        const asset = await assetService.createAsset(req.body);

        res.status(201).json({
            success: true,
            message: "Asset created successfully",
            data: asset
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Assets
const getAllAssets = async (req, res) => {
    try {

        const assets = await assetService.getAllAssets();

        res.status(200).json({
            success: true,
            data: assets
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Asset By ID
const getAssetById = async (req, res) => {
    try {

        const asset = await assetService.getAssetById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.status(200).json({
            success: true,
            data: asset
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getAssetByCode = async (req, res) => {
    try {

        const asset = await assetService.getAssetByCode(
            req.params.assetCode
        );

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.json({
            success: true,
            data: asset
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
const getAssetHistory = async (req, res) => {
  try {
    const history = await assetService.getAssetHistory(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Asset
const updateAsset = async (req, res) => {
    try {

        const asset = await assetService.updateAsset(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Asset updated successfully",
            data: asset
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Asset
const deleteAsset = async (req, res) => {
    try {

        await assetService.deleteAsset(req.params.id);

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  getAssetByCode,
  getAssetHistory,
  updateAsset,
  deleteAsset,
};