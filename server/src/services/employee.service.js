const prisma = require("../prisma/client");

// Create Employee
const createEmployee = async (data) => {
  const existingEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        { employeeCode: data.employeeCode },
        { email: data.email },
      ],
    },
  });

  if (existingEmployee) {
    throw new Error("Employee already exists");
  }

  return await prisma.employee.create({
    data: {
      employeeCode: data.employeeCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
      departmentId: data.departmentId,
      locationId: data.locationId,
      joiningDate: data.joiningDate
        ? new Date(data.joiningDate)
        : null,
      isActive:
        data.isActive !== undefined ? data.isActive : true,
    },
    include: {
      department: true,
      location: true,
    },
  });
};

// Get All Employees
const getAllEmployees = async () => {
  return await prisma.employee.findMany({
    include: {
      department: true,
      location: true,
    },
    orderBy: {
      firstName: "asc",
    },
  });
};

// Get Employee By ID
const getEmployeeById = async (id) => {
  return await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      location: true,
    },
  });
};

// Update Employee
const updateEmployee = async (id, data) => {
  return await prisma.employee.update({
    where: { id },
    data: {
      employeeCode: data.employeeCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
      departmentId: data.departmentId,
      locationId: data.locationId,
      joiningDate: data.joiningDate
        ? new Date(data.joiningDate)
        : null,
      isActive: data.isActive,
    },
    include: {
      department: true,
      location: true,
    },
  });
};

// Delete Employee
const deleteEmployee = async (id) => {
  return await prisma.employee.delete({
    where: { id },
  });
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};