/*
  Warnings:

  - Made the column `binaryData` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "binaryData" SET NOT NULL;
