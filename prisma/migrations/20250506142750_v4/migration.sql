/*
  Warnings:

  - Made the column `title` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about" TEXT;
