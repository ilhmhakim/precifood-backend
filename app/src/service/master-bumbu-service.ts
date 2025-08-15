import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import { DeleteMasterBahanRequest } from '../model/master-bahan-model';
import {
  CreateMasterBumbuRequest,
  GetMasterBumbuRequest,
  MasterBumbuResponse,
  toMasterBumbuResponse,
  UpdateMasterBumbuRequest,
} from '../model/master-bumbu-model';
import { MasterBumbuValidation } from '../validation/master-bumbu-validation';
import { Validation } from '../validation/validation';
import { MasterBumbu } from '@prisma/client';

export class MasterBumbuService {
  static async checkIfBumbuExists(id: number): Promise<boolean> {
    const bumbu: MasterBumbu | null = await prismaClient.masterBumbu.findUnique(
      {
        where: { id },
      }
    );
    return !!bumbu;
  }

  static async checkIfBumbuExistsByNameAndCookingType(
    name: string,
    cooking_type?: string
  ): Promise<boolean> {
    const bumbu: MasterBumbu | null = await prismaClient.masterBumbu.findUnique(
      {
        where: { name, cooking_type },
      }
    );
    return !!bumbu;
  }

  static async createNewBumbu(
    request: CreateMasterBumbuRequest
  ): Promise<MasterBumbuResponse> {
    const createBumbuRequest = Validation.validate(
      MasterBumbuValidation.CREATE,
      request
    );

    const existingBumbu: boolean =
      await this.checkIfBumbuExistsByNameAndCookingType(
        createBumbuRequest.name,
        createBumbuRequest.cooking_type ?? undefined
      );

    if (existingBumbu) {
      throw new ResponseError(
        409,
        `Bumbu dengan nama "${createBumbuRequest.name}" dan tipe masak "${createBumbuRequest.cooking_type}" sudah ada`
      );
    }

    const masterBumbu: MasterBumbu = await prismaClient.masterBumbu.create({
      data: createBumbuRequest,
    });

    return toMasterBumbuResponse(masterBumbu);
  }

  static async getAllMasterBumbu(): Promise<Array<MasterBumbuResponse>> {
    const masterBumbus: MasterBumbu[] = await prismaClient.masterBumbu.findMany(
      {
        orderBy: { name: 'asc' },
      }
    );

    return masterBumbus.map((masterBahan) =>
      toMasterBumbuResponse(masterBahan)
    );
  }

  static async getMasterBumbu(
    request: GetMasterBumbuRequest
  ): Promise<MasterBumbuResponse> {
    const getMasterBahanRequest = Validation.validate(
      MasterBumbuValidation.GET,
      request
    );

    const masterBumbu: MasterBumbu | null =
      await prismaClient.masterBumbu.findUnique({
        where: { id: getMasterBahanRequest.id },
      });

    if (!masterBumbu) {
      throw new ResponseError(
        404,
        `Master Bumbu dengan ID ${getMasterBahanRequest.id} tidak ditemukan`
      );
    }

    return toMasterBumbuResponse(masterBumbu);
  }

  static async updateMasterBumbu(
    request: UpdateMasterBumbuRequest
  ): Promise<MasterBumbuResponse> {
    const updateMasterBumbuRequest = Validation.validate(
      MasterBumbuValidation.UPDATE,
      request
    );

    const isExist: Boolean = await this.checkIfBumbuExists(
      updateMasterBumbuRequest.id
    );
    if (!isExist) {
      throw new ResponseError(
        404,
        `Bumbu dengan ID ${updateMasterBumbuRequest.id} tidak ditemukan`
      );
    }

    if (
      updateMasterBumbuRequest.name ||
      updateMasterBumbuRequest.cooking_type
    ) {
      const existingBumbu = await prismaClient.masterBumbu.findFirst({
        where: {
          AND: [
            { id: { not: updateMasterBumbuRequest.id } },
            {
              OR: [
                {
                  name: updateMasterBumbuRequest.name,
                  cooking_type: updateMasterBumbuRequest.cooking_type,
                },
              ],
            },
          ],
        },
      });

      if (existingBumbu) {
        throw new ResponseError(
          409,
          `Bumbu dengan nama "${updateMasterBumbuRequest.name}" dan tipe masak "${updateMasterBumbuRequest.cooking_type}" sudah ada`
        );
      }
    }

    const updatedMasterBumbu = await prismaClient.masterBumbu.update({
      where: {
        id: updateMasterBumbuRequest.id,
      },
      data: {
        name: updateMasterBumbuRequest.name,
        cooking_type: updateMasterBumbuRequest.cooking_type,
        bdd: updateMasterBumbuRequest.bdd,
        calory: updateMasterBumbuRequest.calory,
        protein: updateMasterBumbuRequest.protein,
        fat: updateMasterBumbuRequest.fat,
        carbohydrate: updateMasterBumbuRequest.carbohydrate,
        fiber: updateMasterBumbuRequest.fiber,
        natrium: updateMasterBumbuRequest.natrium,
        cholesterol: updateMasterBumbuRequest.cholesterol,
        sfa: updateMasterBumbuRequest.sfa,
        mufa: updateMasterBumbuRequest.mufa,
        pufa: updateMasterBumbuRequest.pufa,
      },
    });

    return toMasterBumbuResponse(updatedMasterBumbu);
  }

  static async deleteMasterBumbu(
    request: DeleteMasterBahanRequest
  ): Promise<void> {
    const deleteMasterBumbuRequest = Validation.validate(
      MasterBumbuValidation.DELETE,
      request
    );

    const isExist: Boolean = await this.checkIfBumbuExists(
      deleteMasterBumbuRequest.id
    );
    if (!isExist) {
      throw new ResponseError(
        404,
        `Bumbu dengan ID ${deleteMasterBumbuRequest.id} tidak ditemukan`
      );
    }

    await prismaClient.masterBumbu.delete({
      where: {
        id: deleteMasterBumbuRequest.id,
      },
    });
  }
}
