/*
  Warnings:

  - The values [PARTIALLY_FILLED] on the enum `SwapStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `approvedAt` on the `SwapFulfillment` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `SwapFulfillment` table. All the data in the column will be lost.
  - You are about to drop the column `timeBlockId` on the `SwapFulfillment` table. All the data in the column will be lost.
  - You are about to drop the column `requesterId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `timeBlockId` on the `SwapRequest` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `committee` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftAssignmentId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SwapStatus_new" AS ENUM ('OPEN', 'FILLED', 'CANCELLED');
ALTER TABLE "SwapRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SwapRequest" ALTER COLUMN "status" TYPE "SwapStatus_new" USING ("status"::text::"SwapStatus_new");
ALTER TYPE "SwapStatus" RENAME TO "SwapStatus_old";
ALTER TYPE "SwapStatus_new" RENAME TO "SwapStatus";
DROP TYPE "SwapStatus_old";
ALTER TABLE "SwapRequest" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- DropForeignKey
ALTER TABLE "SwapFulfillment" DROP CONSTRAINT "SwapFulfillment_timeBlockId_fkey";

-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_timeBlockId_fkey";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "committee" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SwapFulfillment" DROP COLUMN "approvedAt",
DROP COLUMN "approvedBy",
DROP COLUMN "timeBlockId";

-- AlterTable
ALTER TABLE "SwapRequest" DROP COLUMN "requesterId",
DROP COLUMN "shiftId",
DROP COLUMN "timeBlockId",
ADD COLUMN     "shiftAssignmentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ShiftAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShiftAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_shiftAssignmentId_fkey" FOREIGN KEY ("shiftAssignmentId") REFERENCES "ShiftAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
