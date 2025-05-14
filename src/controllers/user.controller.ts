import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorUtil from '../utils/error';

const prisma = new PrismaClient();

const updateUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const {
    dateOfBirth,
    nationality,
    idType,
    idNumber,
    idDocumentUrl,
    addressLine1,
    addressLine2,
    city,
    countryId,
  } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const country = await prisma.country.findUnique({
      where: { id: countryId },
    });
    if (!country) {
      return res.status(404).json({ message: 'Country not supported' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          nationality,
          idType,
          idNumber,
          idDocumentUrl,
          addressLine1,
          addressLine2,
          city,
          countryId,
        },
      });

      const accountNumber = await generateUniqueAccountNumber(tx);

      await tx.account.create({
        data: {
          userId: userId!,
          currencyId: country.currencyId,
          balance: 0,
          accountNumber,
          isPrimary: true,
          countryId: country.id,
          name: 'Primary Account',
        },
      });
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    errorUtil.handleError(res, error, 'updating user');
  }
};

const generateUniqueAccountNumber = async (tx: Prisma.TransactionClient): Promise<string> => {
  let accountNumber = '';
  let isUnique = false;

  while (!isUnique) {
    accountNumber = `ACC-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await tx.account.findUnique({
      where: { accountNumber },
    });
    isUnique = !existing;
  }

  return accountNumber;
};

export default {
  updateUser,
};
