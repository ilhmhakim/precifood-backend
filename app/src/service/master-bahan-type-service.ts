import { prismaClient } from '../application/database';
import {
  MasterBahanTypeResponse,
  toMasterBahanTypeResponse,
} from '../model/master-bahan-type-model';
import { MasterBahanType } from '@prisma/client';

export class MasterBahanTypeService {
  static async getAllMasterBahanTypes(): Promise<
    Array<MasterBahanTypeResponse>
  > {
    const masterBahanTypes: MasterBahanType[] =
      await prismaClient.masterBahanType.findMany({
        orderBy: { name: 'asc' },
      });

    return masterBahanTypes.map((masterBahanType) =>
      toMasterBahanTypeResponse(masterBahanType)
    );
  }
}
