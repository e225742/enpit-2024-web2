/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_questionId_fkey";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "Image";
