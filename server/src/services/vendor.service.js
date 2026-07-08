const prisma = require("../prisma/client");

// Create Vendor
const createVendor = async (data) => {

    // Check if vendor already exists
    const existingVendor = await prisma.vendor.findFirst({
        where: {
            name: data.name
        }
    });

    if (existingVendor) {
        throw new Error("Vendor already exists");
    }

    const vendor = await prisma.vendor.create({
        data: {
            name: data.name,
            contactPerson: data.contactPerson,
            email: data.email,
            phone: data.phone,
            address: data.address
        }
    });

    return vendor;
};

// Get All Vendors
const getAllVendors = async () => {

    return await prisma.vendor.findMany({
        orderBy: {
            name: "asc"
        }
    });

};

// Get Vendor By ID
const getVendorById = async (id) => {

    return await prisma.vendor.findUnique({
        where: {
            id
        }
    });

};

// Update Vendor
const updateVendor = async (id, data) => {

    return await prisma.vendor.update({
        where: {
            id
        },
        data: {
            name: data.name,
            contactPerson: data.contactPerson,
            email: data.email,
            phone: data.phone,
            address: data.address
        }
    });

};

// Delete Vendor
const deleteVendor = async (id) => {

    return await prisma.vendor.delete({
        where: {
            id
        }
    });

};

module.exports = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};