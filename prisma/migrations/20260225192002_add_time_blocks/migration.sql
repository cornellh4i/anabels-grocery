/*
  Warnings:

  - You are about to drop the column `endTime` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `blockEnd` on the `SwapFulfillment` table. All the data in the column will be lost.
  - You are about to drop the column `blockStart` on the `SwapFulfillment` table. All the data in the column will be lost.
  - You are about to drop the column `blockEnd` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `blockStart` on the `SwapRequest` table. All the data in the column will be lost.
  - Added the required column `timeBlockId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeBlockId` to the `SwapFulfillment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeBlockId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'EXCUSED';

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "markedBy" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "timeBlockId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SwapFulfillment" DROP COLUMN "blockEnd",
DROP COLUMN "blockStart",
ADD COLUMN     "timeBlockId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SwapRequest" DROP COLUMN "blockEnd",
DROP COLUMN "blockStart",
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "timeBlockId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TimeBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_timeBlockId_fkey" FOREIGN KEY ("timeBlockId") REFERENCES "TimeBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_timeBlockId_fkey" FOREIGN KEY ("timeBlockId") REFERENCES "TimeBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapFulfillment" ADD CONSTRAINT "SwapFulfillment_timeBlockId_fkey" FOREIGN KEY ("timeBlockId") REFERENCES "TimeBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
