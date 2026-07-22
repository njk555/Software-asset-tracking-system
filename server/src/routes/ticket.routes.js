const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");
const upload = require("../middlewares/upload.middleware");

/**
 * Dashboard
 */
router.get("/stats", ticketController.getTicketStats);

/**
 * CRUD
 */
router.post(
  "/",
  upload.single("attachment"),
  ticketController.createTicket
);
router.get("/", ticketController.getAllTickets);

router.get("/:id", ticketController.getTicketById);

router.put("/:id", ticketController.updateTicket);

router.delete("/:id", ticketController.deleteTicket);

/**
 * Assignment
 */
router.patch("/:id/assign", ticketController.assignTicket);

/**
 * Status
 */
router.patch("/:id/status", ticketController.updateStatus);

/**
 * Comments
 */
router.post("/:id/comments", ticketController.addComment);

/**
 * Attachments
 */
router.post(
  "/:id/attachments",
  upload.single("file"),
  ticketController.uploadAttachment
);

module.exports = router;