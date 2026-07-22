const locationService = require("../services/location.service");

// Get All Locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await locationService.getAllLocations();

    res.json({
      success: true,
      data: locations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Location By ID
exports.getLocation = async (req, res) => {
  try {
    const location = await locationService.getLocationById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      data: location,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create Location
exports.createLocation = async (req, res) => {
  try {
    const location = await locationService.createLocation(req.body);

    res.status(201).json({
      success: true,
      data: location,
    });
  } catch (err) {
    if (err.message === "Location already exists") {
      return res.status(409).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Location
exports.updateLocation = async (req, res) => {
  try {
    const location = await locationService.updateLocation(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: location,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Location
exports.deleteLocation = async (req, res) => {
  try {
    await locationService.deleteLocation(req.params.id);

    res.json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Location is assigned to assets or employees.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};