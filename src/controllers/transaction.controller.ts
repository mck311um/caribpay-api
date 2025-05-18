import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import errorUtil from '../utils/error';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const transfer = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { accountNumber, amount, recipient, fee, reference } = req.body;

  try {
    const sendingAccount = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });
    const feeAmount = fee ? (fee / 100) * amount : 0;
    const totalAmount = amount + feeAmount;

    if (!sendingAccount) return res.status(404).json({ message: 'Sender account not found' });
    if (sendingAccount.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (sendingAccount.balance < amount)
      return res.status(400).json({ message: 'Insufficient funds' });

    const receivingAccount = await prisma.account.findUnique({
      where: { accountNumber: recipient },
    });

    if (!receivingAccount) return res.status(404).json({ message: 'Recipient account not found' });
    if (receivingAccount.accountNumber === sendingAccount.accountNumber)
      return res.status(400).json({ message: 'Cannot send funds to the same account' });
    if (sendingAccount.isDeleted || receivingAccount.isDeleted)
      return res.status(400).json({ message: 'One of the accounts is deleted' });

    const senderCurrency = await prisma.currency.findUnique({
      where: { id: sendingAccount.currencyId },
    });

    const recipientCurrency = await prisma.currency.findUnique({
      where: { id: receivingAccount.currencyId },
    });

    const result = await prisma.$transaction(async (tx) => {
      let rate = 1.0;
      const transferGroupId = randomUUID();

      if (senderCurrency?.id !== recipientCurrency?.id) {
        const exchangeRate = await tx.currencyExchangeRate.findFirst({
          where: {
            fromCurrencyId: senderCurrency?.id,
            toCurrencyId: recipientCurrency?.id,
          },
        });

        if (!exchangeRate) {
          throw new Error('Exchange rate not found');
        }

        rate = exchangeRate.rate.toNumber();
      }

      const convertedAmount = amount * rate;

      await tx.account.update({
        where: { id: sendingAccount.id },
        data: { balance: { decrement: totalAmount } },
      });

      await tx.account.update({
        where: { id: receivingAccount.id },
        data: { balance: { increment: convertedAmount } },
      });

      const senderTxn = await tx.transaction.create({
        data: {
          accountId: sendingAccount.id,
          amount: -totalAmount,
          fee: feeAmount,
          transactionType: 'TRANSFER',
          status: 'COMPLETED',
          createdAt: new Date(),
          completedAt: new Date(),
          direction: 'OUTGOING',
          reference,
          transferGroupId,
          userId: sendingAccount.userId,
        },
      });

      const recipientTxn = await tx.transaction.create({
        data: {
          accountId: receivingAccount.id,
          amount: convertedAmount,
          fee: 0,
          transactionType: 'TRANSFER',
          status: 'COMPLETED',
          createdAt: new Date(),
          completedAt: new Date(),
          direction: 'INCOMING',
          reference,
          transferGroupId,
          userId: receivingAccount.userId,
        },
      });

      return { senderTxn, recipientTxn };
    });

    return res.status(200).json({
      message: 'Funds transferred successfully',
      data: result,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'sending funds');
  }
};

const internalTransfer = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { accountNumber, amount, recipient, fee, reference } = req.body;
  try {
    const sendingAccount = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });
    const feeAmount = fee ? (fee / 100) * amount : 0;
    const totalAmount = amount + feeAmount;

    if (!sendingAccount) return res.status(404).json({ message: 'Sender account not found' });
    if (sendingAccount.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (sendingAccount.balance < totalAmount)
      return res.status(400).json({ message: 'Insufficient funds' });

    const receivingAccount = await prisma.account.findUnique({
      where: { accountNumber: recipient },
    });

    if (!receivingAccount) return res.status(404).json({ message: 'Recipient account not found' });
    if (receivingAccount.accountNumber === sendingAccount.accountNumber)
      return res.status(400).json({ message: 'Cannot send funds to the same account' });
    if (sendingAccount.userId !== receivingAccount.userId)
      return res.status(403).json({ message: 'Unauthorized' });
    if (sendingAccount.isDeleted || receivingAccount.isDeleted)
      return res.status(400).json({ message: 'One of the accounts is deleted' });

    const result = await prisma.$transaction(async (tx) => {
      const transferGroupId = randomUUID();

      await tx.account.update({
        where: { id: sendingAccount.id },
        data: { balance: { decrement: totalAmount } },
      });

      await tx.account.update({
        where: { id: receivingAccount.id },
        data: { balance: { increment: amount } },
      });

      const senderTxn = await tx.transaction.create({
        data: {
          accountId: sendingAccount.id,
          amount: -totalAmount,
          fee: feeAmount,
          transactionType: 'TRANSFER_INTERNAL',
          status: 'COMPLETED',
          createdAt: new Date(),
          completedAt: new Date(),
          direction: 'OUTGOING',
          reference,
          transferGroupId,
          userId: sendingAccount.userId,
        },
      });

      const recipientTxn = await tx.transaction.create({
        data: {
          accountId: receivingAccount.id,
          amount: amount,
          fee: 0,
          transactionType: 'TRANSFER_INTERNAL',
          status: 'COMPLETED',
          createdAt: new Date(),
          completedAt: new Date(),
          direction: 'INCOMING',
          reference,
          transferGroupId,
          userId: receivingAccount.userId,
        },
      });

      return { senderTxn, recipientTxn };
    });

    return res.status(200).json({
      message: 'Funds transferred successfully',
      data: result,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'transferring funds');
  }
};

const getTransactions = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          include: {
            user: true,
            currency: true,
            country: true,
          },
        },
      },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    return res.status(200).json({
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'retrieving transactions');
  }
};

const getTransactionHistory = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { accountNumber } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (account.isDeleted) return res.status(400).json({ message: 'Account is deleted' });

    const transactions = await prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    return res.status(200).json({
      message: 'Transaction history retrieved successfully',
      data: transactions,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'retrieving transaction history');
  }
};

const fundAccount = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { accountNumber, amount, fee, reference } = req.body;

  try {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (account.isDeleted) return res.status(400).json({ message: 'Account is deleted' });

    const result = await prisma.$transaction(async (tx) => {
      const feeAmount = fee ? (fee / 100) * amount : 0;
      const totalAmount = amount + feeAmount;

      const txn = await tx.transaction.create({
        data: {
          accountId: account.id,
          amount,
          fee: feeAmount,
          transactionType: 'DEPOSIT',
          status: 'PENDING',
          createdAt: new Date(),
          completedAt: new Date(),
          direction: 'INCOMING',
          reference,
          userId: account.userId,
        },
      });

      return txn;
    });

    return res.status(200).json({
      message: 'Account funded successfully',
      data: result,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'funding account');
  }
};

const updateFunding = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { status, amount } = req.body;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    const account = await prisma.account.findUnique({
      where: { id: transaction?.accountId },
    });

    const allowedStatuses = ['SUCCESS', 'FAILED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (account.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    if (transaction.status !== 'PENDING')
      return res.status(400).json({ message: 'Invalid status' });

    const result = await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id },
        data: {
          status,
          amount,
          completedAt: new Date(),
        },
      });

      if (status === 'SUCCESS') {
        await tx.account.update({
          where: { id: transaction.accountId },
          data: {
            balance: { increment: amount },
          },
        });
      }

      return transaction;
    });

    return res.status(200).json({
      message: 'Funding updated successfully',
      data: result,
    });
  } catch (error: any) {
    errorUtil.handleError(res, error, 'updating funding');
  }
};

export default {
  transfer,
  internalTransfer,
  getTransactionHistory,
  fundAccount,
  getTransactions,
  updateFunding,
};
