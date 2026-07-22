const prisma = require("../prisma/client");

// Create Category
const createCategory = async (data) => {

    const existingCategory = await prisma.assetCategory.findFirst({
        where: {
            name: data.name
        }
    });

    if (existingCategory) {
        throw new Error("Category already exists");
    }

    return await prisma.assetCategory.create({
        data: {
            name: data.name,
            description: data.description,
            status: data.status || "ACTIVE"
        }
    });

};

// Get All Categories
const getAllCategories = async () => {

    return await prisma.assetCategory.findMany({
        orderBy: {
            name: "asc"
        }
    });

};

// Get Category By ID
const getCategoryById = async (id) => {

    return await prisma.assetCategory.findUnique({
        where: {
            id
        }
    });

};

// Update Category
const updateCategory = async (id, data) => {

    return await prisma.assetCategory.update({
        where: {
            id
        },
        data: {
            name: data.name,
            description: data.description,
            status: data.status
        }
    });

};

// Delete Category
const deleteCategory = async (id) => {

    return await prisma.assetCategory.delete({
        where: {
            id
        }
    });

};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};