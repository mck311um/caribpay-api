/*
  Warnings:

  - Added the required column `userId` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Peer" ADD COLUMN     "userId" TEXT NOT NULL;
