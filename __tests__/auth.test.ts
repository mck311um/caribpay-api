import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let testUserEmail = 'testuser@example.com';

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testUserEmail },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testUserEmail },
  });

  await prisma.$disconnect();
});

describe('POST auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'testuser@example.com',
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User',
      phone: '+18761234567',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.userData.email).toBe('testuser@example.com');
    expect(res.body.userData.fullName).toBe('Test User');
  });

  it('should not allow duplicate email or phone', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'testuser@example.com',
      password: 'AnotherPass123!',
      firstName: 'New',
      lastName: 'Person',
      phone: '+18761234567',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});
