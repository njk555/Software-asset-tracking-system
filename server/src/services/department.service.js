const prisma = require("../prisma/client");

// Create Department
const createDepartment = async (data) => {
  const existingDepartment = await prisma.department.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingDepartment) {
    throw new Error("Department already exists");
  }

  return await prisma.department.create({
    data: {
      name: data.name,
      description: data.description,
      manager: data.manager,
    },
  });
};

// Get All Departments
const getAllDepartments = async () => {
  return await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

// Get Department By ID
const getDepartmentById = async (id) => {
  return await prisma.department.findUnique({
    where: {
      id,
    },
  });
};

// Update Department
const updateDepartment = async (id, data) => {
  return await prisma.department.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
      manager: data.manager,
    },
  });
};

// Delete Department
const deleteDepartment = async (id) => {
  return await prisma.department.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};