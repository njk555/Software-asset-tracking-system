const prisma = require("../config/prisma");

/**
 * Generate Ticket Number
 * Example: TKT-20260720-0001
 */
async function generateTicketNumber() {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const prefix = `TKT-${yyyy}${mm}${dd}`;

  const count = await prisma.ticket.count({
    where: {
      ticketNumber: {
        startsWith: prefix,
      },
    },
  });

  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

/**
 * Create Ticket
 */
async function createTicket(data) {
  const ticketNumber = await generateTicketNumber();

  return prisma.ticket.create({
    data: {
      ticketNumber,
      title: data.title,
      description: data.description,
      priority: data.priority || "MEDIUM",
      status: data.status || "OPEN",
      category: data.category,
      departmentId: data.departmentId,
      employeeId: data.employeeId || null,
      assignedToId: data.assignedToId || null,
    },
    include: {
      employee: true,
      department: true,
      assignedTo: true,
    },
  });
}

/**
 * Get All Tickets
 */
async function getAllTickets() {
  return prisma.ticket.findMany({
    include: {
      employee: true,
      department: true,
      assignedTo: true,
      comments: true,
      attachments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get Ticket By ID
 */
async function getTicketById(id) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      employee: true,
      department: true,
      assignedTo: true,
      comments: {
        include: {
          user: true,
        },
      },
      attachments: true,
      history: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

/**
 * Update Ticket
 */
async function updateTicket(id, data) {
  return prisma.ticket.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      category: data.category,
      departmentId: data.departmentId,
      employeeId: data.employeeId || null,
      assignedToId: data.assignedToId || null,
    },
    include: {
      employee: true,
      department: true,
      assignedTo: true,
    },
  });
}

/**
 * Delete Ticket
 */
async function deleteTicket(id) {
  return prisma.ticket.delete({
    where: { id },
  });
}

/**
 * Assign Ticket
 */
async function assignTicket(id, assignedToId) {
  return prisma.ticket.update({
    where: { id },
    data: {
      assignedToId,
    },
  });
}

/**
 * Update Ticket Status
 */
async function updateStatus(id, status) {
  return prisma.ticket.update({
    where: { id },
    data: {
      status,
    },
  });
}

/**
 * Add Comment
 */
async function addComment(ticketId, userId, comment) {
  return prisma.ticketComment.create({
    data: {
      ticketId,
      userId,
      comment,
    },
    include: {
      user: true,
    },
  });
}

/**
 * Upload Attachment
 */
async function addAttachment(ticketId, fileName, fileUrl) {
  return prisma.ticketAttachment.create({
    data: {
      ticketId,
      fileName,
      fileUrl,
    },
  });
}

/**
 * Dashboard Statistics
 */
async function getTicketStats() {
  const [
    total,
    open,
    inProgress,
    onHold,
    resolved,
    closed,
    critical,
  ] = await Promise.all([
    prisma.ticket.count(),

    prisma.ticket.count({
      where: { status: "OPEN" },
    }),

    prisma.ticket.count({
      where: { status: "IN_PROGRESS" },
    }),

    prisma.ticket.count({
      where: { status: "ON_HOLD" },
    }),

    prisma.ticket.count({
      where: { status: "RESOLVED" },
    }),

    prisma.ticket.count({
      where: { status: "CLOSED" },
    }),

    prisma.ticket.count({
      where: { priority: "CRITICAL" },
    }),
  ]);

  return {
    total,
    open,
    inProgress,
    onHold,
    resolved,
    closed,
    critical,
  };
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
  addAttachment,
  getTicketStats,
};