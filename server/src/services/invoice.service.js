const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TAX_RATES = {
  GST_CGST_SGST: 18,
  IGST: 18,
  GST_EXEMPT: 0,
  ZERO_RATED: 0,
  REVERSE_CHARGE: 0,
  TDS: -10,
  TCS: 1,
  NON_GST: 0,
};

const PAYMENT_TERM_DAYS = {
  ADVANCE_100: 0,
  ADVANCE_50_COMPLETION_50: 0,
  CREDIT_15_DAYS: 15,
  CREDIT_30_DAYS: 30,
  DUE_ON_RECEIPT: 0,
};

const include = { vendor: true, department: true };

function calculateInvoice({ invoiceDate, paymentTerm, taxType, subtotalAmount }) {
  const amount = Number(subtotalAmount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Subtotal amount must be greater than zero");
  if (!(taxType in TAX_RATES) || !(paymentTerm in PAYMENT_TERM_DAYS)) throw new Error("Invalid tax type or payment term");
  const taxRate = TAX_RATES[taxType];
  const taxAmount = Number((amount * taxRate / 100).toFixed(2));
  const dueDate = new Date(invoiceDate);
  if (Number.isNaN(dueDate.getTime())) throw new Error("A valid invoice date is required");
  dueDate.setDate(dueDate.getDate() + PAYMENT_TERM_DAYS[paymentTerm]);
  return { subtotalAmount: amount, taxRate, taxAmount, totalAmount: Number((amount + taxAmount).toFixed(2)), dueDate };
}

async function listInvoices() {
  const invoices = await prisma.invoice.findMany({ include, orderBy: { dueDate: "asc" } });
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Promise.all(invoices.map((invoice) => invoice.status === "PENDING" && new Date(invoice.dueDate) < today
    ? prisma.invoice.update({ where: { id: invoice.id }, data: { status: "OVERDUE" }, include })
    : invoice));
}

async function createInvoice(data, file) {
  if (!data.vendorId || !data.invoiceNumber?.trim()) throw new Error("Vendor and invoice number are required");
  const calculations = calculateInvoice(data);
  return prisma.invoice.create({ data: {
    vendorId: data.vendorId, departmentId: data.departmentId || null, invoiceNumber: data.invoiceNumber.trim(),
    invoiceDate: new Date(data.invoiceDate), paymentTerm: data.paymentTerm, taxType: data.taxType, notes: data.notes?.trim() || null,
    ...calculations, ...(file && { fileName: file.originalname, fileUrl: `/uploads/invoices/${file.filename}` }),
  }, include });
}

async function markPaid(id) {
  return prisma.invoice.update({ where: { id }, data: { status: "PAID" }, include });
}

async function getDueReminders(daysAhead = 7) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today); cutoff.setDate(cutoff.getDate() + Number(daysAhead));
  const invoices = await listInvoices();
  return invoices.filter((invoice) => invoice.status !== "PAID" && new Date(invoice.dueDate) <= cutoff).map((invoice) => ({
    type: new Date(invoice.dueDate) < today ? "OVERDUE" : "UPCOMING_DUE",
    channel: ["EMAIL", "MOBILE_PUSH"],
    recipient: invoice.department?.name || "Finance",
    invoice,
  }));
}

module.exports = { TAX_RATES, PAYMENT_TERM_DAYS, calculateInvoice, listInvoices, createInvoice, markPaid, getDueReminders };
