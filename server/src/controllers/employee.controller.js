const employeeService = require("../services/employee.service");

// Get All Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();

    res.json({
      success: true,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Employee By ID
exports.getEmployee = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    if (err.message === "Employee already exists") {
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

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id);

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Employee is assigned to assets.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};