const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*
---------------------------------------
Generate PO Number
Example:
PO20260001
PO20260002
---------------------------------------
*/
async function generatePONumber() {

    const year = new Date().getFullYear();

    const latestPO = await prisma.purchaseOrder.findFirst({
        orderBy: {
            createdAt: "desc"
        }
    });

    if (!latestPO) {
        return `PO${year}0001`;
    }

    const latestNumber = parseInt(
        latestPO.poNumber.replace(`PO${year}`, "")
    );

    const nextNumber = latestNumber + 1;

    return `PO${year}${nextNumber
        .toString()
        .padStart(4, "0")}`;
}

/*
---------------------------------------
Get All Purchase Orders
---------------------------------------
*/
async function getPurchaseOrders() {

    return await prisma.purchaseOrder.findMany({

        include: {

            vendor: true,

            items: {
                include: {
                    category: true
                }
            }

        },

        orderBy: {
            createdAt: "desc"
        }

    });

}

/*
---------------------------------------
Get Purchase Order By ID
---------------------------------------
*/
async function getPurchaseOrder(id) {

    return await prisma.purchaseOrder.findUnique({

        where: { id },

        include: {

            vendor: true,

            items: {
                include: {
                    category: true
                }
            }

        }

    });

}

/*
---------------------------------------
Create Purchase Order
---------------------------------------
*/
async function createPurchaseOrder(data) {

    const poNumber = await generatePONumber();

    let total = 0;

    data.items.forEach(item => {

        total +=
            item.quantity *
            item.unitPrice;

    });

    return await prisma.purchaseOrder.create({

        data: {

            poNumber,

            vendorId: data.vendorId,

            orderDate: new Date(data.orderDate),

            expectedDelivery:
                data.expectedDelivery
                    ? new Date(data.expectedDelivery)
                    : null,

            remarks: data.remarks,

            totalAmount: total,

            status: "DRAFT",

            items: {

                create: data.items.map(item => ({

                    assetName: item.assetName,

                    categoryId: item.categoryId,

                    quantity: Number(item.quantity),

                    unitPrice: Number(item.unitPrice),

                    totalPrice:
                        Number(item.quantity) *
                        Number(item.unitPrice)

                }))

            }

        },

        include: {

            vendor: true,

            items: {
                include: {
                    category: true
                }
            }

        }

    });

}

module.exports = {

    getPurchaseOrders,

    getPurchaseOrder,

    createPurchaseOrder,

    updatePurchaseOrder,

    deletePurchaseOrder,

    updatePurchaseOrderStatus

};
/*
---------------------------------------
Update Purchase Order
---------------------------------------
*/
async function updatePurchaseOrder(id, data) {

    const existing = await prisma.purchaseOrder.findUnique({
        where: { id }
    });

    if (!existing) {
        throw new Error("Purchase Order not found");
    }

    let total = 0;

    data.items.forEach(item => {
        total += Number(item.quantity) * Number(item.unitPrice);
    });

    // Delete old items
    await prisma.purchaseOrderItem.deleteMany({
        where: {
            purchaseOrderId: id
        }
    });

    // Update PO
    return await prisma.purchaseOrder.update({

        where: {
            id
        },

        data: {

            vendorId: data.vendorId,

            orderDate: new Date(data.orderDate),

            expectedDelivery:
                data.expectedDelivery
                    ? new Date(data.expectedDelivery)
                    : null,

            remarks: data.remarks,

            totalAmount: total,

            status: data.status || existing.status,

            items: {

                create: data.items.map(item => ({

                    assetName: item.assetName,

                    categoryId: item.categoryId,

                    quantity: Number(item.quantity),

                    unitPrice: Number(item.unitPrice),

                    totalPrice:
                        Number(item.quantity) *
                        Number(item.unitPrice)

                }))

            }

        },

        include: {

            vendor: true,

            items: {
                include: {
                    category: true
                }
            }

        }

    });

}

/*
---------------------------------------
Delete Purchase Order
---------------------------------------
*/
async function deletePurchaseOrder(id) {

    await prisma.purchaseOrderItem.deleteMany({
        where: {
            purchaseOrderId: id
        }
    });

    return await prisma.purchaseOrder.delete({
        where: {
            id
        }
    });

}

/*
---------------------------------------
Update Purchase Order Status
---------------------------------------
*/
async function updatePurchaseOrderStatus(id, status) {

    return await prisma.purchaseOrder.update({

        where: {
            id
        },

        data: {
            status
        }

    });

}