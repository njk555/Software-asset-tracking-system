const ticketService = require("../services/ticket.service");

/**
 * Create Ticket
 */
async function createTicket(req, res) {
  try {
    const ticket = await ticketService.createTicket(req.body);

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get All Tickets
 */
async function getAllTickets(req, res) {
  try {
    const tickets = await ticketService.getAllTickets();

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get Ticket By ID
 */
async function getTicketById(req, res) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Update Ticket
 */
async function updateTicket(req, res) {
  try {
    const ticket = await ticketService.updateTicket(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Delete Ticket
 */
async function deleteTicket(req, res) {
  try {
    await ticketService.deleteTicket(req.params.id);

    res.json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Assign Ticket
 */
async function assignTicket(req, res) {
  try {
    const ticket = await ticketService.assignTicket(
      req.params.id,
      req.body.assignedToId
    );

    res.json({
      success: true,
      message: "Ticket assigned successfully",
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Update Status
 */
async function updateStatus(req, res) {
  try {
    const ticket = await ticketService.updateStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      message: "Ticket status updated successfully",
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Add Comment
 */
async function addComment(req, res) {
  try {
    const comment = await ticketService.addComment(
      req.params.id,
      req.body.userId,
      req.body.comment
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Upload Attachment
 */
async function uploadAttachment(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const attachment = await ticketService.addAttachment(
      req.params.id,
      req.file.originalname,
      `/uploads/tickets/${req.file.filename}`
    );

    res.status(201).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: attachment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Dashboard Statistics
 */
async function getTicketStats(req, res) {
  try {
    const stats = await ticketService.getTicketStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  assignTicket,
  updateStatus,
  addComment,
  uploadAttachment,
  getTicketStats,
};