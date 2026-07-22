const prisma = require("../prisma/client");

// Create Location
const createLocation = async (data) => {
  const existingLocation = await prisma.location.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingLocation) {
    throw new Error("Location already exists");
  }

  return await prisma.location.create({
    data: {
      name: data.name,
      building: data.building,
      floor: data.floor,
      room: data.room,
    },
  });
};

// Get All Locations
const getAllLocations = async () => {
  return await prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

// Get Location By ID
const getLocationById = async (id) => {
  return await prisma.location.findUnique({
    where: {
      id,
    },
  });
};

// Update Location
const updateLocation = async (id, data) => {
  return await prisma.location.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      building: data.building,
      floor: data.floor,
      room: data.room,
    },
  });
};

// Delete Location
const deleteLocation = async (id) => {
  return await prisma.location.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};