import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let user1Token: string;
let user2Token: string;
let account1: any;
let account2: any;
let exchangeRate: any;

beforeAll(async () => {
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.country.deleteMany();
  await prisma.user.deleteMany();
  await prisma.currencyExchangeRate.deleteMany();
  await prisma.currency.deleteMany();

  const currencyTSD = await prisma.currency.upsert({
    where: { code: 'TSD' },
    update: {},
    create: { name: 'Test Dollar', code: 'TSD', symbol: 'T$' },
  });

  const currencyUSD = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: { name: 'US Dollar', code: 'USD', symbol: '$' },
  });

  const countryTSD = await prisma.country.upsert({
    where: { code: 'TL' },
    update: { currencyId: currencyTSD.id },
    create: { name: 'Testland', code: 'TL', currencyId: currencyTSD.id },
  });

  const countryUSD = await prisma.country.upsert({
    where: { code: 'US' },
    update: { currencyId: currencyUSD.id },
    create: { name: 'United States', code: 'US', currencyId: currencyUSD.id },
  });

  // Register User 1 (Testland)
  const res1 = await request(app).post('/api/v1/auth/register').send({
    email: 'account1@test.com',
    password: 'TestPass123!',
    firstName: 'User1',
    lastName: 'Test',
    phone: '+1111111111',
  });
  user1Token = res1.body.token;

  // Register User 2
  const res2 = await request(app).post('/api/v1/auth/register').send({
    email: 'account2@test.com',
    password: 'TestPass123!',
    firstName: 'User2',
    lastName: 'Test',
    phone: '+2222222222',
  });
  user2Token = res2.body.token;

  const user1 = await prisma.user.findUnique({ where: { email: 'account1@test.com' } });
  const user2 = await prisma.user.findUnique({ where: { email: 'account2@test.com' } });

  account1 = await prisma.account.create({
    data: {
      userId: user1!.id,
      accountNumber: 'ACC-1001',
      balance: 0,
      currencyId: currencyTSD.id, // Test Dollar
      name: 'Primary Account',
      isPrimary: true,
      countryId: countryTSD.id,
    },
  });

  account2 = await prisma.account.create({
    data: {
      userId: user2!.id,
      accountNumber: 'ACC-1002',
      balance: 0,
      currencyId: currencyUSD.id, // US Dollar
      name: 'Primary Account',
      isPrimary: true,
      countryId: countryUSD.id,
    },
  });

  account1 = await prisma.account.findFirst({ where: { user: { email: 'account1@test.com' } } });
  account2 = await prisma.account.findFirst({ where: { user: { email: 'account2@test.com' } } });

  exchangeRate = await prisma.currencyExchangeRate.create({
    data: {
      fromCurrencyId: currencyTSD.id,
      toCurrencyId: currencyUSD.id,
      rate: 0.5,
    },
  });

  // Fund User1's account manually
  await prisma.account.update({
    where: { id: account1.id },
    data: { balance: 1000 },
  });
});

afterAll(async () => {
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany({
    where: { email: { in: ['account1@test.com', 'account2@test.com'] } },
  });
  await prisma.$disconnect();
});

describe('POST /api/v1/transaction/transfer', () => {
  it('should transfer funds between two users', async () => {
    const res = await request(app)
      .post('/api/v1/transaction/transfer')
      .set('x-auth-token', user1Token)
      .send({
        accountNumber: account1.accountNumber,
        recipient: account2.accountNumber,
        amount: 100,
        fee: 5,
        reference: 'Test transfer',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Funds transferred successfully');

    const sender = await prisma.account.findUnique({ where: { id: account1.id } });
    const recipient = await prisma.account.findUnique({ where: { id: account2.id } });

    expect(Number(sender?.balance)).toBe(895);
    expect(Number(recipient?.balance)).toBe(50);
  });
});

describe('POST /api/v1/transaction/transfer/internal', () => {
  it('should transfer funds between same user accounts', async () => {
    const newAccount = await prisma.account.create({
      data: {
        userId: account1.userId,
        isPrimary: false,
        accountNumber: 'INTL-2222',
        currencyId: account1.currencyId,
        balance: 0,
        name: 'Secondary Account',
        countryId: account1.countryId,
      },
    });

    const res = await request(app)
      .post('/api/v1/transaction/transfer/internal')
      .set('x-auth-token', user1Token)
      .send({
        accountNumber: account1.accountNumber,
        recipient: newAccount.accountNumber,
        amount: 100,
        fee: 0,
        reference: 'Internal move',
      });

    expect(res.statusCode).toBe(200);

    const updatedFrom = await prisma.account.findUnique({ where: { id: account1.id } });
    const updatedTo = await prisma.account.findUnique({ where: { id: newAccount.id } });

    expect(Number(updatedFrom?.balance)).toBe(795);
    expect(Number(updatedTo?.balance)).toBe(100);
  });
});

describe('POST /api/v1/transaction/fund', () => {
  it('should create a pending funding transaction', async () => {
    const res = await request(app)
      .post('/api/v1/transaction/fund')
      .set('x-auth-token', user1Token)
      .send({
        accountNumber: account1.accountNumber,
        amount: 500,
        fee: 2,
        reference: 'Top up',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('PENDING');
  });
});

describe('PATCH /api/v1/transaction/fund/:id', () => {
  let pendingFundingId: string;

  beforeAll(async () => {
    const txn = await prisma.transaction.create({
      data: {
        accountId: account1.id,
        amount: 200,
        fee: 0,
        transactionType: 'DEPOSIT',
        status: 'PENDING',
        direction: 'INCOMING',
        createdAt: new Date(),
      },
    });

    pendingFundingId = txn.id;
  });

  it('should finalize a pending fund and increase balance', async () => {
    const res = await request(app)
      .patch(`/api/v1/transaction/fund/${pendingFundingId}`)
      .set('x-auth-token', user1Token)
      .send({
        status: 'SUCCESS',
        amount: 200,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Funding updated successfully');

    const updatedTxn = await prisma.transaction.findUnique({ where: { id: pendingFundingId } });
    const updatedAccount = await prisma.account.findUnique({ where: { id: account1.id } });

    expect(updatedTxn?.status).toBe('SUCCESS');
    expect(Number(updatedAccount?.balance)).toBeGreaterThanOrEqual(795 + 200);
  });

  it('should reject invalid status', async () => {
    const txn = await prisma.transaction.create({
      data: {
        accountId: account1.id,
        amount: 100,
        fee: 0,
        transactionType: 'DEPOSIT',
        status: 'PENDING',
        direction: 'INCOMING',
        createdAt: new Date(),
      },
    });

    const res = await request(app)
      .patch(`/api/v1/transaction/fund/${txn.id}`)
      .set('x-auth-token', user1Token)
      .send({
        status: 'INVALID_STATUS',
        amount: 100,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid status');
  });
});

describe('POST /api/v1/transaction/transfer', () => {
  it('should transfer funds between two users with different currencies', async () => {
    const amount = 100;
    const fee = 5;
    const reference = 'Test transfer';

    const res = await request(app)
      .post('/api/v1/transaction/transfer')
      .set('x-auth-token', user1Token)
      .send({
        accountNumber: account1.accountNumber,
        recipient: account2.accountNumber,
        amount,
        fee,
        reference,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Funds transferred successfully');

    const sender = await prisma.account.findUnique({ where: { id: account1.id } });
    expect(Number(sender?.balance)).toBe(890);

    const recipient = await prisma.account.findUnique({ where: { id: account2.id } });
    expect(Number(recipient?.balance)).toBe(100);
  });
});
