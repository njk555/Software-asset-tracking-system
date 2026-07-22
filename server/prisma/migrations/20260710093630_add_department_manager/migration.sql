-- AlterTable
ALTER TABLE "AssetCategory" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "manager" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
