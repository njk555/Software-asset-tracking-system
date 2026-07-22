/*
  Warnings:

  - You are about to drop the `AssetAssignmentHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetAssignmentHistory" DROP CONSTRAINT "AssetAssignmentHistory_assetId_fkey";

-- DropForeignKey
ALTER TABLE "AssetAssignmentHistory" DROP CONSTRAINT "AssetAssignmentHistory_employeeId_fkey";

-- DropTable
DROP TABLE "AssetAssignmentHistory";
