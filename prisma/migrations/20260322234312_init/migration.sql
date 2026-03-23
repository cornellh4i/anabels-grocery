/*
  Warnings:

  - You are about to drop the column `userId` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `timeBlockId` on the `SwapRequest` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `committee` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftAssignmentId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_timeBlockId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "userId",
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "committee" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SwapRequest" DROP COLUMN "shiftId",
DROP COLUMN "timeBlockId",
ADD COLUMN     "shiftAssignmentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ShiftAssignment" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShiftAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftAssignment" ADD CONSTRAINT "ShiftAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_shiftAssignmentId_fkey" FOREIGN KEY ("shiftAssignmentId") REFERENCES "ShiftAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
