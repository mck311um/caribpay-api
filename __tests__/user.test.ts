import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let testUserId: string;
let token: string;
let countryId: string;

beforeAll(async () => {
  await prisma.account.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'updateuser@example.com' } });
  await prisma.country.deleteMany();

  const currency = await prisma.currency.upsert({
    where: { code: 'TSD' },
    update: {},
    create: {
      name: 'Test Dollar',
      code: 'TSD',
      symbol: 'T$',
    },
  });

  const country = await prisma.country.upsert({
    where: { name: 'Testland' },
    update: {
      code: 'TL',
      currencyId: currency.id,
    },
    create: {
      name: 'Testland',
      code: 'TL',
      currencyId: currency.id,
    },
    include: { currency: true },
  });

  countryId = country.id;
  const res = await request(app).post('/api/v1/auth/register').send({
    email: 'updateuser@example.com',
    password: 'Pass123!',
    firstName: 'Update',
    lastName: 'User',
    phone: '+7654321001',
  });

  token = res.body.token;
  const user = await prisma.user.findUnique({ where: { email: 'updateuser@example.com' } });
  testUserId = user!.id;
});

afterAll(async () => {
  await prisma.account.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'updateuser@example.com' } });
  await prisma.country.deleteMany({ where: { id: countryId } });
  await prisma.$disconnect();
});

describe('PATCH /api/v1/user/update', () => {
  it('should update user and create account', async () => {
    const res = await request(app).patch(`/api/v1/user/update`).set('x-auth-token', token).send({
      dateOfBirth: '1990-01-01',
      nationality: 'Testian',
      idType: 'PASSPORT',
      idNumber: 'A1234567',
      idDocumentUrl: 'http://example.com/doc.png',
      addressLine1: '123 Main St',
      addressLine2: 'Suite 4',
      city: 'Testville',
      countryId,
    });

    expect(res.statusCode).toBe(200);

    const account = await prisma.account.findFirst({ where: { userId: testUserId } });
    expect(account).toBeTruthy();
    expect(account?.isPrimary).toBe(true);
  });

  it('should fail with invalid country ID', async () => {
    const res = await request(app).patch(`/api/v1/user/update`).set('x-auth-token', token).send({
      dateOfBirth: '1990-01-01',
      nationality: 'Testian',
      idType: 'PASSPORT',
      idNumber: 'A1234567',
      idDocumentUrl: 'http://example.com/doc.png',
      addressLine1: '123 Main St',
      addressLine2: 'Suite 4',
      city: 'Testville',
      countryId: '00000000-0000-0000-0000-000000000000',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Country not supported');
  });

  it('should fail if user not found', async () => {
    await prisma.account.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });

    const res = await request(app).patch(`/api/v1/user/update`).set('x-auth-token', token).send({
      dateOfBirth: '1990-01-01',
      nationality: 'Testian',
      idType: 'PASSPORT',
      idNumber: 'A1234567',
      idDocumentUrl: 'http://example.com/doc.png',
      addressLine1: '123 Main St',
      addressLine2: 'Suite 4',
      city: 'Testville',
      countryId,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
