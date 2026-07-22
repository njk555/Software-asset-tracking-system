const prisma = require("../prisma/client");

const actorName = (actor) => actor?.fullName || actor?.email || "System";

const snapshot = (asset) => ({
    assetCode: asset.assetCode,
    assetName: asset.assetName,
    serialNumber: asset.serialNumber,
    model: asset.model,
    manufacturer: asset.manufacturer,
    purchaseDate: asset.purchaseDate?.toISOString?.() || asset.purchaseDate || null,
    purchaseCost: asset.purchaseCost,
    warrantyExpiry: asset.warrantyExpiry?.toISOString?.() || asset.warrantyExpiry || null,
    condition: asset.condition,
    status: asset.status,
    vendorId: asset.vendorId,
    categoryId: asset.categoryId,
    locationId: asset.locationId,
    employeeId: asset.employeeId
});

const assetInclude = {
    vendor: true,
    category: true,
    location: true,
    employee: true
};

async function addAudit(tx, { asset, action, actor, description, beforeData = null, afterData = null }) {
    return tx.auditLog.create({
        data: {
            assetId: asset.id,
            entityType: "ASSET",
            entityId: asset.id,
            action,
            actorName: actorName(actor),
            description,
            beforeData,
            afterData
        }
    });
}

const createAsset = async (data, actor) => {
    const existingCode = await prisma.asset.findUnique({ where: { assetCode: data.assetCode } });
    if (existingCode) throw new Error("Asset Code already exists");

    if (data.serialNumber) {
        const existingSerial = await prisma.asset.findUnique({ where: { serialNumber: data.serialNumber } });
        if (existingSerial) throw new Error("Serial Number already exists");
    }

    return prisma.$transaction(async (tx) => {
        const asset = await tx.asset.create({
            data: {
                assetCode: data.assetCode,
                assetName: data.assetName,
                serialNumber: data.serialNumber || null,
                model: data.model || null,
                manufacturer: data.manufacturer || null,
                purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
                purchaseCost: data.purchaseCost ? Number(data.purchaseCost) : null,
                warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
                condition: data.condition || "NEW",
                status: data.status || "AVAILABLE",
                vendorId: data.vendorId,
                categoryId: data.categoryId,
                locationId: data.locationId
            },
            include: assetInclude
        });

        await addAudit(tx, {
            asset,
            action: "CREATED",
            actor,
            description: `Created asset ${asset.assetCode}`,
            afterData: snapshot(asset)
        });
        return asset;
    });
};

const getAllAssets = () => prisma.asset.findMany({
    include: assetInclude,
    orderBy: { assetCode: "asc" }
});

const getAssetById = (id) => prisma.asset.findUnique({
    where: { id },
    include: assetInclude
});
const getAssetByCode = (assetCode) =>
  prisma.asset.findUnique({
    where: { assetCode },
    include: assetInclude,
  });

const updateAsset = async (id, data, actor) => prisma.$transaction(async (tx) => {
    const existing = await tx.asset.findUnique({ where: { id }, include: assetInclude });
    if (!existing) throw new Error("Asset not found");

    const asset = await tx.asset.update({
        where: { id },
        data: {
            assetCode: data.assetCode,
            assetName: data.assetName,
            serialNumber: data.serialNumber || null,
            model: data.model || null,
            manufacturer: data.manufacturer || null,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
            purchaseCost: data.purchaseCost ? Number(data.purchaseCost) : null,
            warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
            condition: data.condition,
            status: data.status,
            vendorId: data.vendorId,
            categoryId: data.categoryId,
            locationId: data.locationId
        },
        include: assetInclude
    });

    await addAudit(tx, {
        asset,
        action: "UPDATED",
        actor,
        description: `Updated asset ${asset.assetCode}`,
        beforeData: snapshot(existing),
        afterData: snapshot(asset)
    });
    return asset;
});

const assignAsset = async (id, employeeId, remarks, actor) => prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id }, include: assetInclude });
    if (!asset) throw new Error("Asset not found");

    const currentEmployee = asset.employee;
    if (employeeId) {
        const employee = await tx.employee.findUnique({ where: { id: employeeId } });
        if (!employee || !employee.isActive) throw new Error("Select an active employee");
        if (asset.employeeId === employeeId) throw new Error("This asset is already assigned to the selected employee");

        if (asset.employeeId) {
            await tx.assetAssignment.updateMany({
                where: { assetId: id, returnedAt: null },
                data: { returnedAt: new Date(), returnedByName: actorName(actor) }
            });
        }

        const updatedAsset = await tx.asset.update({
            where: { id },
            data: { employeeId, status: "ASSIGNED" },
            include: assetInclude
        });
        await tx.assetAssignment.create({
            data: { assetId: id, employeeId, remarks: remarks || null, assignedByName: actorName(actor) }
        });
        await addAudit(tx, {
            asset: updatedAsset,
            action: currentEmployee ? "REASSIGNED" : "ASSIGNED",
            actor,
            description: currentEmployee
                ? `Reassigned ${updatedAsset.assetCode} from ${currentEmployee.firstName} ${currentEmployee.lastName} to ${updatedAsset.employee.firstName} ${updatedAsset.employee.lastName}`
                : `Assigned ${updatedAsset.assetCode} to ${updatedAsset.employee.firstName} ${updatedAsset.employee.lastName}`,
            beforeData: snapshot(asset),
            afterData: snapshot(updatedAsset)
        });
        return updatedAsset;
    }

    if (!asset.employeeId) throw new Error("This asset is not assigned");
    await tx.assetAssignment.updateMany({
        where: { assetId: id, returnedAt: null },
        data: { returnedAt: new Date(), returnedByName: actorName(actor) }
    });
    const updatedAsset = await tx.asset.update({
        where: { id },
        data: { employeeId: null, status: "AVAILABLE" },
        include: assetInclude
    });
    await addAudit(tx, {
        asset: updatedAsset,
        action: "UNASSIGNED",
        actor,
        description: `Unassigned ${updatedAsset.assetCode} from ${currentEmployee.firstName} ${currentEmployee.lastName}`,
        beforeData: snapshot(asset),
        afterData: snapshot(updatedAsset)
    });
    return updatedAsset;
});

const getAssetHistory = (id) => prisma.asset.findUnique({
    where: { id },
    select: {
        assignments: {
            include: { employee: true },
            orderBy: { assignedAt: "desc" }
        },
        auditLogs: { orderBy: { createdAt: "desc" } }
    }
});

const deleteAsset = (id) => prisma.asset.delete({ where: { id } });

module.exports = {
    createAsset,
    getAllAssets,
    getAssetById,
    getAssetByCode,   // <-- add this
    updateAsset,
    assignAsset,
    getAssetHistory,
    deleteAsset
};
