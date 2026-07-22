const purchaseOrderService = require("../services/purchaseOrder.service");
const { buildPurchaseOrderPdf } = require("../utils/purchaseOrderPdf");

/*
---------------------------------------
Get All Purchase Orders
---------------------------------------
*/
exports.getPurchaseOrders = async (req, res) => {

    try {

        const purchaseOrders =
            await purchaseOrderService.getPurchaseOrders();

        res.status(200).json({
            success: true,
            data: purchaseOrders
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
---------------------------------------
Get Purchase Order By ID
---------------------------------------
*/
exports.getPurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder =
            await purchaseOrderService.getPurchaseOrder(req.params.id);

        if (!purchaseOrder) {

            return res.status(404).json({
                success: false,
                message: "Purchase Order not found"
            });

        }

        res.status(200).json({
            success: true,
            data: purchaseOrder
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
---------------------------------------
Create Purchase Order
---------------------------------------
*/
exports.createPurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder =
            await purchaseOrderService.createPurchaseOrder(req.body);

        res.status(201).json({
            success: true,
            message: "Purchase Order created successfully",
            data: purchaseOrder
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
---------------------------------------
Update Purchase Order
---------------------------------------
*/
exports.updatePurchaseOrder = async (req, res) => {

    try {

        const purchaseOrder =
            await purchaseOrderService.updatePurchaseOrder(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Purchase Order updated successfully",
            data: purchaseOrder
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
---------------------------------------
Delete Purchase Order
---------------------------------------
*/
exports.deletePurchaseOrder = async (req, res) => {

    try {

        await purchaseOrderService.deletePurchaseOrder(req.params.id);

        res.status(200).json({
            success: true,
            message: "Purchase Order deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
---------------------------------------
Update Status
---------------------------------------
*/
exports.updateStatus = async (req, res) => {

    try {

        const purchaseOrder =
            await purchaseOrderService.updatePurchaseOrderStatus(
                req.params.id,
                req.body.status
            );

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: purchaseOrder
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
---------------------------------------
Download Purchase Order PDF
---------------------------------------
*/
exports.downloadPurchaseOrderPdf = async (req, res) => {
    try {
        const purchaseOrder = await purchaseOrderService.getPurchaseOrder(req.params.id);

        if (!purchaseOrder) {
            return res.status(404).json({ success: false, message: "Purchase Order not found" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${purchaseOrder.poNumber}.pdf`);
        const document = buildPurchaseOrderPdf(purchaseOrder);
        document.pipe(res);
        document.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
