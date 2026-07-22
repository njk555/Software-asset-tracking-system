-- CreateEnum
CREATE TYPE "AmcStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE "AmcNotificationType" AS ENUM ('EXPIRY_REMINDER', 'SERVICE_REMINDER_15_DAYS', 'SERVICE_REMINDER_7_DAYS');

-- CreateTable
CREATE TABLE "AmcContract" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "serviceIntervalMonths" INTEGER NOT NULL DEFAULT 3,
    "nextServiceDate" TIMESTAMP(3),
    "lastServiceDate" TIMESTAMP(3),
    "status" "AmcStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AmcContract_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AmcNotification" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "type" "AmcNotificationType" NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "recipient" TEXT NOT NULL,
    "channels" JSONB NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AmcNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AmcContract_contractNumber_key" ON "AmcContract"("contractNumber");
CREATE INDEX "AmcContract_expiryDate_status_idx" ON "AmcContract"("expiryDate", "status");
CREATE INDEX "AmcContract_nextServiceDate_status_idx" ON "AmcContract"("nextServiceDate", "status");
CREATE UNIQUE INDEX "AmcNotification_contractId_type_scheduledFor_key" ON "AmcNotification"("contractId", "type", "scheduledFor");
CREATE INDEX "AmcNotification_isRead_createdAt_idx" ON "AmcNotification"("isRead", "createdAt");
ALTER TABLE "AmcContract" ADD CONSTRAINT "AmcContract_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AmcContract" ADD CONSTRAINT "AmcContract_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AmcNotification" ADD CONSTRAINT "AmcNotification_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "AmcContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
