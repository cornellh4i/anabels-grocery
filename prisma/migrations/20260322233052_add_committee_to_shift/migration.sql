/*
  Warnings:

  - You are about to drop the column `capacity` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `committee` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `shiftAssignmentId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the `ShiftAssignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeBlockId` to the `SwapFulfillment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeBlockId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SwapStatus" ADD VALUE 'PARTIALLY_FILLED';

-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_shiftAssignmentId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "capacity",
DROP COLUMN "committee",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SwapFulfillment" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "timeBlockId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SwapRequest" DROP COLUMN "shiftAssignmentId",
ADD COLUMN     "requesterId" TEXT NOT NULL,
ADD COLUMN     "shiftId" TEXT NOT NULL,
ADD COLUMN     "timeBlockId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ShiftAssignment";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_timeBlockId_fkey" FOREIGN KEY ("timeBlockId") REFERENCES "TimeBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapFulfillment" ADD CONSTRAINT "SwapFulfillment_timeBlockId_fkey" FOREIGN KEY ("timeBlockId") REFERENCES "TimeBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
