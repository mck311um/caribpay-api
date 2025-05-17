import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import errorUtil from '../utils/error';
import functions from '../utils/functions';

const prisma = new PrismaClient();

const getAccountBalance = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { accountNumber } = req.params;
  try {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (account.isDeleted) return res.status(400).json({ message: 'Account is deleted' });

    return res.status(200).json({
      message: 'Wallet balance retrieved successfully',
      data: { balance: account.balance },
    });
  } catch (error: any) {
    errorUtil.handleError(error, res, 'retrieving wallet balance');
  }
};

const deleteAccount = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { accountNumber } = req.params;
  try {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (account.isDeleted) return res.status(400).json({ message: 'Account is already deleted' });
    if (account.balance.gt(0.0))
      return res.status(400).json({ message: 'Account balance must be 0 before deletion' });
    if (account.isPrimary)
      return res.status(400).json({ message: 'Primary account cannot be deleted' });

    await prisma.account.update({
      where: { id: account.id },
      data: { isDeleted: true },
    });

    return res.status(200).json({
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    errorUtil.handleError(error, res, 'deleting account');
  }
};

const getAccounts = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { limit = 20, offset = 0 } = req.query;
  try {
    const accounts = await prisma.account.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        country: true,
        currency: true,
      },
    });

    return res.status(200).json({
      message: 'Accounts retrieved successfully',
      data: accounts,
    });
  } catch (error: any) {
    errorUtil.handleError(error, res, 'retrieving accounts');
  }
};

const addAccount = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { name } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const country = await prisma.country.findUnique({
      where: { id: user!.countryId! },
    });

    const accountNumber = await functions.generateUniqueAccountNumber();

    await prisma.account.create({
      data: {
        userId: userId!,
        currencyId: country!.currencyId,
        balance: 0,
        accountNumber,
        isPrimary: true,
        countryId: country!.id,
        name,
      },
    });

    const accounts = await prisma.account.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        country: true,
        currency: true,
      },
    });
    return res.status(200).json(accounts);
  } catch (error: any) {
    errorUtil.handleError(error, res, 'adding account');
  }
};

export default {
  getAccountBalance,
  deleteAccount,
  getAccounts,
  addAccount,
};
