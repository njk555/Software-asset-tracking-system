const router = require("express").Router();
const controller = require("../controllers/purchaseRequest.controller");
const upload = require("../middlewares/purchaseRequestUpload.middleware");

router.get("/workflows", controller.getWorkflows);
router.post("/workflows", controller.createWorkflow);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", upload.array("quotations", 10), controller.create);
router.patch("/:id/action", controller.action);

module.exports = router;
