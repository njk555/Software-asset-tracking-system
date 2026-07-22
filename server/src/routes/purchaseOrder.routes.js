const express = require("express");

const router = express.Router();

const purchaseOrderController =
require("../controllers/purchaseOrder.controller");

router.get(
    "/",
    purchaseOrderController.getPurchaseOrders
);

router.get(
    "/:id/pdf",
    purchaseOrderController.downloadPurchaseOrderPdf
);

router.get(
    "/:id",
    purchaseOrderController.getPurchaseOrder
);

router.post(
    "/",
    purchaseOrderController.createPurchaseOrder
);

router.put(
    "/:id",
    purchaseOrderController.updatePurchaseOrder
);

router.put(
    "/:id/status",
    purchaseOrderController.updateStatus
);

router.delete(
    "/:id",
    purchaseOrderController.deletePurchaseOrder
);

module.exports = router;
