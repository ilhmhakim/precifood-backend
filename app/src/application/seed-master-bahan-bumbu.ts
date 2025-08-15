import { ResponseError } from '../error/response-error';
import { prismaClient } from './database';
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

    const masterBahanData = [
      {
        name: 'Ayam',
        type_id: typeMap.get('utama') || 1,
        bdd: 58,
        calory: 298,
        protein: 18.2,
        fat: 25,
        carbohydrate: 0,
        fiber: 0,
        natrium: 109,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
      {
        name: 'Ikan Patin',
        type_id: typeMap.get('utama') || 1,
        bdd: 80,
        calory: 132,
        protein: 17,
        fat: 6.6,
        carbohydrate: 0,
        fiber: 0,
        natrium: 77,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
      {
        name: 'Minyak Goreng',
        type_id: typeMap.get('pelengkap') || 2,
        bdd: 100,
        calory: 884,
        protein: 0,
        fat: 100,
        carbohydrate: 0,
        fiber: 0,
        natrium: 0,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
    ];

    const masterBumbuData = [
      {
        name: 'Adonan Basah',
        cooking_type: null,
        bdd: 100,
        calory: 162,
        protein: 5,
        fat: 2,
        carbohydrate: 33,
        fiber: 0,
        natrium: 427,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
      {
        name: 'Kremes',
        cooking_type: null,
        bdd: 100,
        calory: 97.408963911525,
        protein: 0.962724097788126,
        fat: 1.19750873108265,
        carbohydrate: 20.5753958090803,
        fiber: 0.209545983701979,
        natrium: 217.442258440047,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
      {
        name: 'Bumbu Ungkep Kuning',
        cooking_type: null,
        bdd: 100,
        calory: 12,
        protein: 0,
        fat: 1,
        carbohydrate: 1,
        fiber: 0,
        natrium: 606,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
      {
        name: 'Marinasi / Marinated',
        cooking_type: null,
        bdd: 100,
        calory: 5,
        protein: 0,
        fat: 0,
        carbohydrate: 1,
        fiber: 1,
        natrium: 857,
        cholesterol: 0,
        sfa: 0,
        mufa: 0,
        pufa: 0,
      },
    ];

    // Upsert MasterBahan
    for (const bahan of masterBahanData) {
      await prismaClient.masterBahan.upsert({
        where: { name: bahan.name },
        update: bahan,
        create: bahan,
      });
    }

    // Upsert MasterBumbu
    for (const bumbu of masterBumbuData) {
      await prismaClient.masterBumbu.upsert({
        where: { name: bumbu.name },
        update: bumbu,
        create: bumbu,
      });
    }

    res.status(200).json({
      message: 'Master Bahan and Master Bumbu seeded/updated successfully',
    });
  } catch (e) {
    next(e);
  }
}
