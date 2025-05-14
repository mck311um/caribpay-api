import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let testUserEmail = 'testuser@example.com';
let testPassword = 'SecurePass123!';
let testPhone = '+7671234567';

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
      email: testUserEmail,
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: testPhone,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.userData.email).toBe('testuser@example.com');
    expect(res.body.userData.fullName).toBe('Test User');
  });
});

describe('POST auth/register - duplicate checks', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUserEmail } });

    await request(app).post('/api/v1/auth/register').send({
      email: testUserEmail,
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User',
      phone: testPhone,
    });
  });

  it('should not allow duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: testUserEmail,
      password: 'AnotherPass123!',
      firstName: 'New',
      lastName: 'User',
      phone: '+18765554444',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });

  it('should not allow duplicate phone number', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'another@example.com',
      password: 'AnotherPass123!',
      firstName: 'New',
      lastName: 'User',
      phone: testPhone,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Phone number already exists');
  });
});

describe('POST auth/login', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUserEmail } });

    await request(app).post('/api/v1/auth/register').send({
      email: testUserEmail,
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: testPhone,
    });
  });

  it('should login an existing user and return a token', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUserEmail,
      password: 'SecurePass123!',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.userData.email).toBe(testUserEmail);
    expect(res.body.userData.fullName).toBe('Test User');
  });
});
