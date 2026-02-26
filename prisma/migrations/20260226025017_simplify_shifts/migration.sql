/*
  Warnings:

  - You are about to drop the column `capacity` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `committee` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `committee` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ShiftAssignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_userId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "capacity",
DROP COLUMN "committee",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "committee";

-- DropTable
DROP TABLE "ShiftAssignment";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
