const router = require("express").Router();
const controller = require("../controllers/amc.controller");
router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id/complete-service", controller.completeService);
router.post("/process-reminders", controller.processReminders);
router.get("/notifications", controller.notifications);
router.patch("/notifications/:id/read", controller.markRead);
module.exports = router;
