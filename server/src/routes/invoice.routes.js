const router = require("express").Router();
const controller = require("../controllers/invoice.controller");
const upload = require("../middlewares/invoiceUpload.middleware");

router.get("/tax-rules", controller.taxRules);
router.get("/reminders", controller.reminders);
router.get("/", controller.list);
router.post("/", upload.single("invoiceFile"), controller.create);
router.patch("/:id/paid", controller.markPaid);
module.exports = router;
