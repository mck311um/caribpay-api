import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorUtil from '../utils/error';

const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      initials: `${user.firstName[0]}${user.lastName[0]}`,
      fullName: `${user.firstName} ${user.lastName}`,
    };

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.status(201).json({ userData, token });
  } catch (error) {
    errorUtil.handleError(res, error, 'registering user');
  }
};

export default {
  registerUser,
};
