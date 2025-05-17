-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Currency" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "CurrencyExchangeRate" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
