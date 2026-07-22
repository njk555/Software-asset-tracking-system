-- CreateEnum
CREATE TYPE "PurchaseRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PurchaseRequestWorkflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "approvalSteps" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PurchaseRequestWorkflow_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "requestedByName" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "preferredVendorId" TEXT,
    "workflowId" TEXT,
    "approvalSteps" JSONB NOT NULL,
    "currentApprovalStep" INTEGER NOT NULL DEFAULT 0,
    "status" "PurchaseRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseRequestItem" (
    "id" TEXT NOT NULL,
    "purchaseRequestId" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "PurchaseRequestItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseRequestQuotation" (
    "id" TEXT NOT NULL,
    "purchaseRequestId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseRequestQuotation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseRequestApproval" (
    "id" TEXT NOT NULL,
    "purchaseRequestId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "approverRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseRequestApproval_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PurchaseRequestWorkflow_name_key" ON "PurchaseRequestWorkflow"("name");
CREATE UNIQUE INDEX "PurchaseRequest_requestNumber_key" ON "PurchaseRequest"("requestNumber");
CREATE INDEX "PurchaseRequest_departmentId_status_idx" ON "PurchaseRequest"("departmentId", "status");
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_preferredVendorId_fkey" FOREIGN KEY ("preferredVendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "PurchaseRequestWorkflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PurchaseRequestItem" ADD CONSTRAINT "PurchaseRequestItem_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PurchaseRequestQuotation" ADD CONSTRAINT "PurchaseRequestQuotation_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PurchaseRequestApproval" ADD CONSTRAINT "PurchaseRequestApproval_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
