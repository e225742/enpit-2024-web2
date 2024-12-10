/*
  Warnings:

  - You are about to drop the column `image` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
