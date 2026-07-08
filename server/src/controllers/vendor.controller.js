const vendorService = require("../services/vendor.service");

// Create Vendor
const createVendor = async (req, res) => {
    try {
        const vendor = await vendorService.createVendor(req.body);

        res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: vendor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Vendors
const getAllVendors = async (req, res) => {

    try {

        const vendors = await vendorService.getAllVendors();

        res.status(200).json({
            success: true,
            data: vendors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Vendor By ID
const getVendorById = async (req, res) => {

    try {

        const vendor = await vendorService.getVendorById(req.params.id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vendor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Vendor
const updateVendor = async (req, res) => {

    try {

        const vendor = await vendorService.updateVendor(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            data: vendor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Vendor
const deleteVendor = async (req, res) => {

    try {

        await vendorService.deleteVendor(req.params.id);

        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};