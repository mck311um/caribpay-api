/*
  Warnings:

  - You are about to drop the column `exchangeRate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiverAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `ExchangeRate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderAccountId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "exchangeRate",
DROP COLUMN "receiverAccountId",
DROP COLUMN "senderAccountId",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;

-- DropTable
DROP TABLE "ExchangeRate";

-- CreateTable
CREATE TABLE "_AccountToTransaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccountToTransaction_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AccountToTransaction_B_index" ON "_AccountToTransaction"("B");

-- AddForeignKey
ALTER TABLE "_AccountToTransaction" ADD CONSTRAINT "_AccountToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToTransaction" ADD CONSTRAINT "_AccountToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
