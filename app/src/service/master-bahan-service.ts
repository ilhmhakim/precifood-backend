import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
  CreateMasterBahanRequest,
  DeleteMasterBahanRequest,
  GetMasterBahanRequest,
  MasterBahanResponse,
  toMasterBahanResponse,
  UpdateMasterBahanRequest,
} from '../model/master-bahan-model';
import { MasterBahanValidation } from '../validation/master-bahan-validation';
import { Validation } from '../validation/validation';
import { MasterBahan } from '@prisma/client';

export class MasterBahanService {
  static async checkIfBahanExists(id: number): Promise<boolean> {
    const bahan: MasterBahan | null = await prismaClient.masterBahan.findUnique(
      {
        where: { id },
      }
    );
    return !!bahan;
  }

  static async checkIfBahanExistsByNameAndType(
    name: string,
    type: string
  ): Promise<boolean> {
    const bahan: MasterBahan | null = await prismaClient.masterBahan.findUnique(
      {
        where: { name, type },
      }
    );
    return !!bahan;
  }

  static async createNewBahan(
    request: CreateMasterBahanRequest
  ): Promise<MasterBahanResponse> {
    const createBahanRequest = Validation.validate(
      MasterBahanValidation.CREATE,
      request
    );

    const existingBahan: boolean = await this.checkIfBahanExistsByNameAndType(
      createBahanRequest.name,
      createBahanRequest.type
    );

    if (existingBahan) {
      throw new ResponseError(
        409,
        `Bahan dengan nama "${createBahanRequest.name}" dan tipe "${createBahanRequest.type}" sudah ada`
      );
    }

    const masterBahan: MasterBahan = await prismaClient.masterBahan.create({
      data: createBahanRequest,
    });

    return toMasterBahanResponse(masterBahan);
  }

  static async getAllMasterBahan(): Promise<Array<MasterBahanResponse>> {
    const masterBahans: MasterBahan[] = await prismaClient.masterBahan.findMany(
      {
        orderBy: { name: 'asc' },
      }
    );

    return masterBahans.map((masterBahan) =>
      toMasterBahanResponse(masterBahan)
    );
  }

  static async getMasterBahan(
    request: GetMasterBahanRequest
  ): Promise<MasterBahanResponse> {
    const getMasterBahanRequest = Validation.validate(
      MasterBahanValidation.GET,
      request
    );

    const masterBahan: MasterBahan | null =
      await prismaClient.masterBahan.findUnique({
        where: { id: getMasterBahanRequest.id },
      });

    if (!masterBahan) {
      throw new ResponseError(
        404,
        `Bahan dengan ID ${getMasterBahanRequest.id} tidak ditemukan`
      );
    }

    return toMasterBahanResponse(masterBahan);
  }

  static async updateMasterBahan(
    request: UpdateMasterBahanRequest
  ): Promise<MasterBahanResponse> {
    const updateMasterBahanRequest = Validation.validate(
      MasterBahanValidation.UPDATE,
      request
    );

    const isExist: Boolean = await this.checkIfBahanExists(
      updateMasterBahanRequest.id
    );
    if (!isExist) {
      throw new ResponseError(
        404,
        `Bahan dengan ID ${updateMasterBahanRequest.id} tidak ditemukan`
      );
    }

    if (updateMasterBahanRequest.name || updateMasterBahanRequest.type) {
      const existingBahan: MasterBahan | null =
        await prismaClient.masterBahan.findFirst({
          where: {
            AND: [
              { id: { not: updateMasterBahanRequest.id } },
              {
                OR: [
                  {
                    name: updateMasterBahanRequest.name,
                    type: updateMasterBahanRequest.type,
                  },
                ],
              },
            ],
          },
        });

      if (existingBahan) {
        throw new ResponseError(
          409,
          `Bahan dengan nama "${updateMasterBahanRequest.name}" dan tipe "${updateMasterBahanRequest.type}" sudah ada`
        );
      }
    }

    const updatedMasterBahan: MasterBahan =
      await prismaClient.masterBahan.update({
        where: {
          id: updateMasterBahanRequest.id,
        },
        data: {
          name: updateMasterBahanRequest.name,
          type: updateMasterBahanRequest.type,
          bdd: updateMasterBahanRequest.bdd,
          calory: updateMasterBahanRequest.calory,
          protein: updateMasterBahanRequest.protein,
          fat: updateMasterBahanRequest.fat,
          carbohydrate: updateMasterBahanRequest.carbohydrate,
          fiber: updateMasterBahanRequest.fiber,
          natrium: updateMasterBahanRequest.natrium,
          cholesterol: updateMasterBahanRequest.cholesterol,
          sfa: updateMasterBahanRequest.sfa,
          mufa: updateMasterBahanRequest.mufa,
          pufa: updateMasterBahanRequest.pufa,
        },
      });

    return toMasterBahanResponse(updatedMasterBahan);
  }

  static async deleteMasterBahan(
    request: DeleteMasterBahanRequest
  ): Promise<void> {
    const deleteMasterBahanRequest = Validation.validate(
      MasterBahanValidation.DELETE,
      request
    );

    const isExists: Boolean = await this.checkIfBahanExists(
      deleteMasterBahanRequest.id
    );
    if (!isExists) {
      throw new ResponseError(
        404,
        `Bahan dengan ID ${deleteMasterBahanRequest.id} tidak ditemukan`
      );
    }

    await prismaClient.masterBahan.delete({
      where: {
        id: deleteMasterBahanRequest.id,
      },
    });
  }
}
