const express = require("express");

const router = express.Router();

const employeeController = require("../controllers/employee.controller");

// Get All Employees
router.get("/", employeeController.getEmployees);

// Get Employee By ID
router.get("/:id", employeeController.getEmployee);

// Create Employee
router.post("/", employeeController.createEmployee);

// Update Employee
router.put("/:id", employeeController.updateEmployee);

// Delete Employee
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;