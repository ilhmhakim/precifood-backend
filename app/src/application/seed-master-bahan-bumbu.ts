import { ResponseError } from '../error/response-error';
import { prismaClient } from './database';
import {
  masterBahanData,
  masterBumbuData,
} from './seed-data-master-bahan-bumbu';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export async function SeedMasterBahanBumbu(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV !== 'development') {
    return next(
      new ResponseError(
        403,
        'Seed Master Bahan and Master Bumbu endpoint is only available in development mode.'
      )
    );
  }

  try {
    const typeData = [
      { name: 'Utama' },
      { name: 'Pelengkap' },
      { name: 'Dasar' },
    ];

    for (const type of typeData) {
      await prismaClient.masterBahanType.upsert({
        where: { name: type.name },
        update: {},
        create: { name: type.name },
      });
    }

    const types = await prismaClient.masterBahanType.findMany();
    const typeMap = new Map(
      types.map((type) => [type.name.toLowerCase(), type.id])
    );

    // Upsert MasterBahan
    for (const bahan of masterBahanData) {
      const convertedBahan = {
        name: bahan.name,
        type_id: parseInt(bahan.type_id),
        bdd: parseInt(bahan.bdd),
        calory: new Prisma.Decimal(bahan.calory!),
        protein: new Prisma.Decimal(bahan.protein),
        fat: new Prisma.Decimal(bahan.fat),
        carbohydrate: new Prisma.Decimal(bahan.carbohydrate),
        fiber: new Prisma.Decimal(bahan.fiber),
        natrium: new Prisma.Decimal(bahan.natrium),
        cholesterol: new Prisma.Decimal(bahan.cholesterol),
        mufa: new Prisma.Decimal(bahan.mufa),
        pufa: new Prisma.Decimal(bahan.pufa),
        sfa: new Prisma.Decimal(bahan.sfa),
      };
      await prismaClient.masterBahan.upsert({
        where: { name: bahan.name },
        update: convertedBahan,
        create: convertedBahan,
      });
    }

    // Upsert MasterBumbu
    for (const bumbu of masterBumbuData) {
      const convertedbumbu = {
        name: bumbu.name,
        bdd: parseInt(bumbu.bdd),
        calory: new Prisma.Decimal(bumbu.calory!),
        protein: new Prisma.Decimal(bumbu.protein),
        fat: new Prisma.Decimal(bumbu.fat),
        carbohydrate: new Prisma.Decimal(bumbu.carbohydrate),
        fiber: new Prisma.Decimal(bumbu.fiber),
        natrium: new Prisma.Decimal(bumbu.natrium),
        cholesterol: new Prisma.Decimal(bumbu.cholesterol),
        mufa: new Prisma.Decimal(bumbu.mufa),
        pufa: new Prisma.Decimal(bumbu.pufa),
        sfa: new Prisma.Decimal(bumbu.sfa),
      };
      await prismaClient.masterBumbu.upsert({
        where: { name: bumbu.name },
        update: convertedbumbu,
        create: convertedbumbu,
      });
    }

    res.status(200).json({
      message: 'Master Bahan and Master Bumbu seeded/updated successfully',
    });
  } catch (e) {
    next(e);
  }
}
