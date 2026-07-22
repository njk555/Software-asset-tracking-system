-- CreateEnum
CREATE TYPE "InvoiceTaxType" AS ENUM ('GST_CGST_SGST', 'IGST', 'GST_EXEMPT', 'ZERO_RATED', 'REVERSE_CHARGE', 'TDS', 'TCS', 'NON_GST');
CREATE TYPE "InvoicePaymentTerm" AS ENUM ('ADVANCE_100', 'ADVANCE_50_COMPLETION_50', 'CREDIT_15_DAYS', 'CREDIT_30_DAYS', 'DUE_ON_RECEIPT');
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "departmentId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "paymentTerm" "InvoicePaymentTerm" NOT NULL,
    "taxType" "InvoiceTaxType" NOT NULL,
    "subtotalAmount" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "fileName" TEXT,
    "fileUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Invoice_vendorId_invoiceNumber_key" ON "Invoice"("vendorId", "invoiceNumber");
CREATE INDEX "Invoice_dueDate_status_idx" ON "Invoice"("dueDate", "status");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
