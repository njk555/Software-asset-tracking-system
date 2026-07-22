const prisma = require("../prisma/client");

const contractInclude = { asset: { include: { employee: true } }, vendor: true };
const channels = ["EMAIL", "MOBILE_PUSH"];

function startOfDay(value = new Date()) { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; }
function addDays(date, days) { const result = new Date(date); result.setDate(result.getDate() + days); return result; }
function addMonths(date, months) { const result = new Date(date); result.setMonth(result.getMonth() + Number(months)); return result; }
function recipient(contract) { return contract.asset.employee ? `${contract.asset.employee.firstName} ${contract.asset.employee.lastName} (${contract.asset.employee.email})` : "Asset Management Team"; }

async function getContracts() {
  const contracts = await prisma.amcContract.findMany({ include: contractInclude, orderBy: { expiryDate: "asc" } });
  const today = startOfDay();
  return Promise.all(contracts.map((contract) => contract.status === "ACTIVE" && new Date(contract.expiryDate) < today
    ? prisma.amcContract.update({ where: { id: contract.id }, data: { status: "EXPIRED" }, include: contractInclude }) : contract));
}

async function createContract(data) {
  if (!data.contractNumber?.trim() || !data.assetId || !data.vendorId || !data.startDate || !data.expiryDate) throw new Error("Contract number, asset, vendor, start date, and expiry date are required");
  const startDate = startOfDay(data.startDate); const expiryDate = startOfDay(data.expiryDate);
  if (expiryDate <= startDate) throw new Error("Expiry date must be after the start date");
  const interval = Number(data.serviceIntervalMonths || 3);
  if (!Number.isInteger(interval) || interval < 1 || interval > 24) throw new Error("Service interval must be between 1 and 24 months");
  return prisma.amcContract.create({ data: { contractNumber: data.contractNumber.trim(), assetId: data.assetId, vendorId: data.vendorId, startDate, expiryDate, serviceIntervalMonths: interval, nextServiceDate: data.nextServiceDate ? startOfDay(data.nextServiceDate) : addMonths(startDate, interval), notes: data.notes?.trim() || null }, include: contractInclude });
}

async function completeService(id, serviceDate = new Date()) {
  const contract = await prisma.amcContract.findUnique({ where: { id } });
  if (!contract) throw new Error("AMC contract not found");
  const lastServiceDate = startOfDay(serviceDate);
  return prisma.amcContract.update({ where: { id }, data: { lastServiceDate, nextServiceDate: addMonths(lastServiceDate, contract.serviceIntervalMonths) }, include: contractInclude });
}

async function createNotification(contract, type, scheduledFor, message) {
  return prisma.amcNotification.upsert({ where: { contractId_type_scheduledFor: { contractId: contract.id, type, scheduledFor } }, update: {}, create: { contractId: contract.id, type, scheduledFor, recipient: recipient(contract), channels, message } });
}

async function processReminders(asOf = new Date()) {
  const today = startOfDay(asOf); const expiryWindow = addDays(today, 60); const contracts = await getContracts(); const processed = [];
  for (const contract of contracts.filter((item) => item.status === "ACTIVE")) {
    const expiry = startOfDay(contract.expiryDate);
    if (expiry >= today && expiry <= expiryWindow) processed.push(await createNotification(contract, "EXPIRY_REMINDER", expiry, `AMC ${contract.contractNumber} for ${contract.asset.assetName} expires on ${expiry.toLocaleDateString()}.`));
    if (!contract.nextServiceDate) continue;
    const due = startOfDay(contract.nextServiceDate);
    if (due >= today && today >= addDays(due, -15)) processed.push(await createNotification(contract, "SERVICE_REMINDER_15_DAYS", due, `AMC service for ${contract.asset.assetName} is due on ${due.toLocaleDateString()} (15-day reminder).`));
    if (due >= today && today >= addDays(due, -7)) processed.push(await createNotification(contract, "SERVICE_REMINDER_7_DAYS", due, `AMC service for ${contract.asset.assetName} is due on ${due.toLocaleDateString()} (7-day reminder).`));
  }
  return processed;
}

async function getNotifications() { await processReminders(); return prisma.amcNotification.findMany({ include: { contract: { include: contractInclude } }, orderBy: { createdAt: "desc" } }); }
async function markNotificationRead(id) { return prisma.amcNotification.update({ where: { id }, data: { isRead: true } }); }

module.exports = { getContracts, createContract, completeService, processReminders, getNotifications, markNotificationRead };
