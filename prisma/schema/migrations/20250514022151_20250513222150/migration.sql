-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID', 'VOTERS_ID', 'OTHER');

-- CreateEnum
CREATE TYPE "RiskRating" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "accountNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "targetCurrency" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("baseCurrency","targetCurrency")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "senderAccountId" TEXT NOT NULL,
    "receiverAccountId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "exchangeRate" DECIMAL(65,30),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT,
    "idType" "IdType",
    "idNumber" TEXT,
    "idDocumentUrl" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "country" TEXT,
    "riskRating" "RiskRating" NOT NULL DEFAULT 'LOW',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_idNumber_key" ON "User"("idNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_dateOfBirth_key" ON "User"("firstName", "lastName", "dateOfBirth");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderAccountId_fkey" FOREIGN KEY ("senderAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverAccountId_fkey" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
