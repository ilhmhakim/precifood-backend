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
import { RecipeService } from './recipe-service';
import { MasterBahan, Prisma, RecipeItemType } from '@prisma/client';

// TODO: recalculate nutrition performance/appraoch at update and delete could be improved
export class MasterBahanService {
  static async checkIfBahanExists(id: number): Promise<boolean> {
    const bahan: MasterBahan | null = await prismaClient.masterBahan.findUnique(
      {
        where: { id },
      }
    );
    return !!bahan;
  }

  static async checkIfBahanExistsByNameAndTypeId(
    name: string,
    type_id: number
  ): Promise<Prisma.MasterBahanGetPayload<{ include: { type: true } }> | null> {
    const bahan = await prismaClient.masterBahan.findFirst({
      where: { name, type_id },
      include: {
        type: true,
      },
    });
    return bahan;
  }

  static async checkIfBahanTypeExists(id: number): Promise<boolean> {
    const bahanType = await prismaClient.masterBahanType.findUnique({
      where: { id },
    });
    return !!bahanType;
  }

  static async createNewBahan(
    request: CreateMasterBahanRequest
  ): Promise<MasterBahanResponse> {
    const createBahanRequest = Validation.validate(
      MasterBahanValidation.CREATE,
      request
    );

    // Check if type_id exists
    const typeExists = await this.checkIfBahanTypeExists(
      createBahanRequest.type_id
    );
    if (!typeExists) {
      throw new ResponseError(
        404,
        `Tipe bahan dengan ID ${createBahanRequest.type_id} tidak ditemukan`
      );
    }

    const existingBahan = await this.checkIfBahanExistsByNameAndTypeId(
      createBahanRequest.name,
      createBahanRequest.type_id
    );

    if (existingBahan) {
      throw new ResponseError(
        409,
        `Bahan dengan nama "${createBahanRequest.name}" dengan tipe ${existingBahan.type.name} sudah ada`
      );
    }

    const masterBahan = await prismaClient.masterBahan.create({
      data: createBahanRequest,
      include: {
        type: true,
      },
    });

    return toMasterBahanResponse(masterBahan);
  }

  static async getAllMasterBahan(): Promise<Array<MasterBahanResponse>> {
    const masterBahans = await prismaClient.masterBahan.findMany({
      orderBy: { name: 'asc' },
      include: {
        type: true,
      },
    });

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

    const masterBahan = await prismaClient.masterBahan.findUnique({
      where: { id: getMasterBahanRequest.id },
      include: {
        type: true,
      },
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

    const isExist = await this.checkIfBahanExists(updateMasterBahanRequest.id);
    if (!isExist) {
      throw new ResponseError(
        404,
        `Bahan dengan ID ${updateMasterBahanRequest.id} tidak ditemukan`
      );
    }

    if (updateMasterBahanRequest.type_id) {
      const typeExists = await this.checkIfBahanTypeExists(
        updateMasterBahanRequest.type_id
      );
      if (!typeExists) {
        throw new ResponseError(
          404,
          `Tipe bahan dengan ID ${updateMasterBahanRequest.type_id} tidak ditemukan`
        );
      }
    }

    if (updateMasterBahanRequest.name || updateMasterBahanRequest.type_id) {
      const existingBahan = await prismaClient.masterBahan.findFirst({
        where: {
          AND: [
            { id: { not: updateMasterBahanRequest.id } },
            {
              name: updateMasterBahanRequest.name ?? undefined,
              type_id: updateMasterBahanRequest.type_id ?? undefined,
            },
          ],
        },
        include: {
          type: true,
        },
      });

      if (existingBahan) {
        throw new ResponseError(
          409,
          `Bahan dengan nama "${updateMasterBahanRequest.name}" dengan tipe ${existingBahan.type.name} sudah ada`
        );
      }
    }

    const updatedMasterBahan = await prismaClient.masterBahan.update({
      where: {
        id: updateMasterBahanRequest.id,
      },
      data: {
        name: updateMasterBahanRequest.name,
        type_id: updateMasterBahanRequest.type_id,
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
      include: {
        type: true,
      },
    });

    // Recalculate nutrition for menus that use this bahan
    const affectedRecipes = await prismaClient.recipe.findMany({
      where: {
        item_id: updateMasterBahanRequest.id,
        item_type: RecipeItemType.bahan,
      },
      select: { menu_id: true },
    });
    const affectedMenuIds: Array<number> = Array.from(
      new Set(affectedRecipes.map((r) => r.menu_id))
    );

    for (const menuId of affectedMenuIds) {
      await RecipeService.recalculateNutritionInternal(prismaClient, menuId);
    }

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

    // Find all menus affected by this item's deletion
    const affectedRecipes = await prismaClient.recipe.findMany({
      where: {
        item_id: deleteMasterBahanRequest.id,
        item_type: RecipeItemType.bahan,
      },
      select: { menu_id: true },
    });
    const affectedMenuIds: Array<number> = Array.from(
      new Set(affectedRecipes.map((r) => r.menu_id))
    );

    // Delete recipes referencing this item
    await prismaClient.recipe.deleteMany({
      where: {
        item_id: deleteMasterBahanRequest.id,
        item_type: RecipeItemType.bahan,
      },
    });

    // Delete the master item
    await prismaClient.masterBahan.delete({
      where: {
        id: deleteMasterBahanRequest.id,
      },
    });

    // Recalculate nutrition for affected menus
    for (const menuId of affectedMenuIds) {
      await RecipeService.recalculateNutritionInternal(prismaClient, menuId);
    }
  }
}
