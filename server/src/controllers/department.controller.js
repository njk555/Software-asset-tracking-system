const departmentService = require("../services/department.service");

// Get All
exports.getDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();

    res.json({
      success: true,
      data: departments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get One
exports.getDepartment = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.json({
      success: true,
      data: department,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create
exports.createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body);

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (err) {
    if (err.message === "Department already exists") {
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

// Update
exports.updateDepartment = async (req, res) => {
  try {
    const department = await departmentService.updateDepartment(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: department,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete
exports.deleteDepartment = async (req, res) => {
  try {
    await departmentService.deleteDepartment(req.params.id);

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Department is assigned to employees.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};