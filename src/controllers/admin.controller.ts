import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const getData = async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany({});
    const currencies = await prisma.currency.findMany({});

    res.status(200).json({ countries, currencies });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getData,
};
