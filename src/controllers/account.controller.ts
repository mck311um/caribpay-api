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
    errorUtil.handleError(res, error, 'retrieving wallet balance');
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
    errorUtil.handleError(res, error, 'deleting account');
  }
};

const getAccounts = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  try {
    const accounts = await prisma.account.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
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
    errorUtil.handleError(res, error, 'retrieving accounts');
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
        isPrimary: false,
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
    errorUtil.handleError(res, error, 'adding account');
  }
};

const getPeers = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  try {
    const peers = await prisma.peer.findMany({
      where: { userId },
    });

    return res.status(200).json({
      message: 'Peers retrieved successfully',
      data: peers,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'retrieving peers');
  }
};

const addPeer = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { name, accountNumber, phone } = req.body;

  try {
    console.log('Adding peer:', { name, accountNumber, phone });

    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.user.phone !== phone)
      return res.status(403).json({ message: 'Incorrect Phone Number' });
    if (account.isDeleted) return res.status(400).json({ message: 'Account is deleted' });

    await prisma.peer.create({
      data: {
        name,
        phone,
        accountNumber,
        userId: userId!,
      },
    });

    return res.status(200).json({
      message: 'Peer added successfully',
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'adding peer');
  }
};

export default {
  getAccountBalance,
  deleteAccount,
  getAccounts,
  addAccount,
  addPeer,
  getPeers,
};
