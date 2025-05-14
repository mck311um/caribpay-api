/*
  Warnings:

  - You are about to drop the `_AccountToCountry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AccountToCountry" DROP CONSTRAINT "_AccountToCountry_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToCountry" DROP CONSTRAINT "_AccountToCountry_B_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "countryId" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AccountToCountry";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
