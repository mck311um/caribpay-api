import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateUniqueAccountNumber = async (): Promise<string> => {
  let accountNumber = '';
  let isUnique = false;

  while (!isUnique) {
    accountNumber = `ACC-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await prisma.account.findUnique({
      where: { accountNumber },
    });
    isUnique = !existing;
  }

  return accountNumber;
};

export default {
  generateUniqueAccountNumber,
};
