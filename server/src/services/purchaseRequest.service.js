const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const requestInclude = {
  department: true,
  preferredVendor: true,
  workflow: true,
  items: true,
  quotations: true,
  approvals: { orderBy: { createdAt: "asc" } },
};

async function nextRequestNumber() {
  const year = new Date().getFullYear();
  const latest = await prisma.purchaseRequest.findFirst({ orderBy: { createdAt: "desc" } });
  const sequence = latest ? Number(latest.requestNumber.slice(-4)) + 1 : 1;
  return `PR${year}${String(sequence).padStart(4, "0")}`;
}

const defaultSteps = ["Department Manager", "Finance", "Admin"];

function validateRequest(data) {
  if (!data.departmentId || !data.requestedByName || !data.justification || !Number(data.estimatedCost)) {
    throw new Error("Department, requester, justification, and estimated cost are required");
  }
  if (!Array.isArray(data.items) || !data.items.length || data.items.some((item) => !item.itemDescription || Number(item.quantity) < 1)) {
    throw new Error("Add at least one item with a valid description and quantity");
  }
}

async function getPurchaseRequests() {
  return prisma.purchaseRequest.findMany({ include: requestInclude, orderBy: { createdAt: "desc" } });
}

async function getPurchaseRequest(id) {
  return prisma.purchaseRequest.findUnique({ where: { id }, include: requestInclude });
}

async function getWorkflows() {
  return prisma.purchaseRequestWorkflow.findMany({ orderBy: { name: "asc" } });
}

async function createWorkflow(data) {
  const steps = Array.isArray(data.approvalSteps) ? data.approvalSteps.filter(Boolean) : [];
  if (!data.name || !steps.length) throw new Error("Workflow name and at least one approval role are required");
  return prisma.purchaseRequestWorkflow.create({ data: { name: data.name.trim(), approvalSteps: steps, isActive: data.isActive !== false } });
}

async function createPurchaseRequest(data, files = []) {
  validateRequest(data);
  const workflow = data.workflowId ? await prisma.purchaseRequestWorkflow.findUnique({ where: { id: data.workflowId } }) : null;
  if (data.workflowId && !workflow) throw new Error("Selected approval workflow was not found");
  const approvalSteps = workflow?.approvalSteps || defaultSteps;
  return prisma.purchaseRequest.create({
    data: {
      requestNumber: await nextRequestNumber(),
      departmentId: data.departmentId,
      requestedByName: data.requestedByName.trim(),
      justification: data.justification.trim(),
      estimatedCost: Number(data.estimatedCost),
      preferredVendorId: data.preferredVendorId || null,
      workflowId: workflow?.id || null,
      approvalSteps,
      items: { create: data.items.map((item) => ({ itemDescription: item.itemDescription.trim(), quantity: Number(item.quantity) })) },
      quotations: { create: files.map((file) => ({ fileName: file.originalname, fileUrl: `/uploads/purchase-requests/${file.filename}` })) },
    },
    include: requestInclude,
  });
}

async function actOnPurchaseRequest(id, { action, actorName, comment }) {
  const request = await getPurchaseRequest(id);
  if (!request) throw new Error("Purchase request not found");
  if (request.status !== "PENDING") throw new Error("Only pending requests can be actioned");
  if (!actorName?.trim()) throw new Error("Approver name is required");
  const steps = request.approvalSteps;
  const role = steps[request.currentApprovalStep];
  if (!role) throw new Error("No approval step is available");
  if (action !== "APPROVE" && action !== "REJECT") throw new Error("Invalid approval action");
  const rejected = action === "REJECT";
  const finalApproval = request.currentApprovalStep + 1 >= steps.length;
  return prisma.purchaseRequest.update({
    where: { id },
    data: {
      status: rejected ? "REJECTED" : finalApproval ? "APPROVED" : "PENDING",
      currentApprovalStep: rejected || finalApproval ? request.currentApprovalStep : request.currentApprovalStep + 1,
      rejectionReason: rejected ? (comment?.trim() || null) : null,
      approvals: { create: { stepNumber: request.currentApprovalStep + 1, approverRole: role, action, actorName: actorName.trim(), comment: comment?.trim() || null } },
    },
    include: requestInclude,
  });
}

module.exports = { getPurchaseRequests, getPurchaseRequest, getWorkflows, createWorkflow, createPurchaseRequest, actOnPurchaseRequest };
