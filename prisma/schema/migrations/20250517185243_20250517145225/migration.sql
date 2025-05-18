-- CreateTable
CREATE TABLE "Peer" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Peer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "Account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
