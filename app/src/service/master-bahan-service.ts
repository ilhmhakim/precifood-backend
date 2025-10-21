import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
  CreateMasterBahanRequest,
  DeleteMasterBahanRequest,
  GetMasterBahanRequest,
  MasterBahanResponse,
  toMasterBahanResponse,
  UpdateBahanApprovalRequest,
  UpdateMasterBahanRequest,
} from '../model/master-bahan-model';
import { NotificationEnum } from '../model/notification-model';
import { MasterBahanValidation } from '../validation/master-bahan-validation';
import { Validation } from '../validation/validation';
import { RecipeService } from './recipe-service';
import {
  MasterBahan,
  MasterItemStatus,
  Prisma,
  RecipeItemType,
} from '@prisma/client';

// TODO: recalculate nutrition performance/appraoch at update and delete could be improved
export class MasterBahanService {
  static async checkIfBahanExists(id: number): Promise<MasterBahan | null> {
    const bahan: MasterBahan | null = await prismaClient.masterBahan.findUnique(
      {
        where: { id },
      }
    );
    return bahan;
  }

  static async checkIfBahanExistsByNameAndTypeId(
    name: string,
    type_id: number
  ): Promise<Prisma.MasterBahanGetPayload<{ include: { type: true } }> | null> {
    const bahan = await prismaClient.masterBahan.findFirst({
      where: {
        OR: [{ name }, { name, type_id }],
      },
      include: { type: true },
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
    request: CreateMasterBahanRequest,
    userId: string,
    userRole: string
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
        `Bahan dengan nama "${createBahanRequest.name}" (tipe ${existingBahan.type.name}) sudah ada`
      );
    }

    let masterBahan;
    await prismaClient.$transaction(async (tx) => {
      masterBahan = await tx.masterBahan.create({
        data: createBahanRequest,
        include: {
          type: true,
        },
      });

      if (userRole === 'Admin') {
        // If created by Admin, auto-approve
        await tx.masterBahan.update({
          where: { id: masterBahan.id },
          data: { status: MasterItemStatus.Approved },
        });

        await tx.masterBahanApprovalLog.create({
          data: {
            bahan_id: masterBahan.id,
            from_status: null,
            to_status: MasterItemStatus.Approved,
            reason: `Bahan ${masterBahan.name} baru saja dibuat oleh Ahli Gizi dan otomatis disetujui`,
          },
        });

        await tx.notification.create({
          data: {
            title: `Bahan Baru ${masterBahan.name} baru saja dibuat oleh Ahli Gizi dan otomatis disetujui`,
            restaurant_id: 'AHLI_GIZI',
            restaurant_name: 'AHLI_GIZI',
            bahan_id: masterBahan.id,
            bahan_name: masterBahan.name,
          },
        });
      } else if (userRole === 'Restoran') {
        const restaurant = await tx.restaurant.findUnique({
          where: { restaurant_id: userId },
          include: { Contact: true },
        });

        if (!restaurant) {
          throw new ResponseError(
            404,
            `Restoran dengan ID ${userId} tidak ditemukan`
          );
        }

        await tx.masterBahanApprovalLog.create({
          data: {
            bahan_id: masterBahan.id,
            from_status: null,
            to_status: masterBahan.status,
            reason: `Bahan ${masterBahan.name} baru saja dibuat oleh ${restaurant.Contact!.name} dan menunggu persetujuan`,
          },
        });

        await tx.notification.create({
          data: {
            title: `Bahan baru ${masterBahan.name} Menunggu Persetujuan`,
            restaurant_id: userId,
            restaurant_name: restaurant.Contact!.name,
            bahan_id: masterBahan.id,
            bahan_name: masterBahan.name,
          },
        });
      }
    });

    return toMasterBahanResponse(masterBahan!);
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
        approval_logs: true,
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
    request: UpdateMasterBahanRequest,
    userId: string,
    userRole: string
  ): Promise<MasterBahanResponse> {
    const updateMasterBahanRequest = Validation.validate(
      MasterBahanValidation.UPDATE,
      request
    );

    const bahan = await this.checkIfBahanExists(updateMasterBahanRequest.id);
    if (!bahan) {
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

    let updatedMasterBahan;
    await prismaClient.$transaction(async (tx) => {
      updatedMasterBahan = await tx.masterBahan.update({
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
          status:
            userRole === 'Admin'
              ? MasterItemStatus.Approved
              : MasterItemStatus.Waiting, // if updated by Admin, auto-approve; else set back to waiting
        },
        include: {
          type: true,
        },
      });

      if (userRole === 'Restoran') {
        const restaurant = await tx.restaurant.findUnique({
          where: { restaurant_id: userId },
          include: { Contact: true },
        });

        await tx.masterBahanApprovalLog.create({
          data: {
            bahan_id: updateMasterBahanRequest.id,
            from_status: bahan.status,
            to_status: MasterItemStatus.Waiting,
            reason: `Bahan ${updatedMasterBahan.name} diperbarui oleh Restoran dan menunggu persetujuan`,
          },
        });

        await tx.notification.create({
          data: {
            title: `Bahan ${updatedMasterBahan.name} Diperbarui dan Menunggu Persetujuan`,
            restaurant_id: userId,
            restaurant_name: restaurant!.Contact!.name,
            bahan_id: updatedMasterBahan.id,
            bahan_name: updatedMasterBahan.name,
          },
        });
      }

      // Recalculate nutrition for menus that use this bahan
      const affectedRecipes = await tx.recipe.findMany({
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
        await RecipeService.recalculateNutritionInternal(tx, menuId);
      }

      return toMasterBahanResponse(updatedMasterBahan);
    });

    return toMasterBahanResponse(updatedMasterBahan!);
  }

  static async updateBahanApproval(
    request: UpdateBahanApprovalRequest
  ): Promise<void> {
    const updateBahanApprovalRequest = Validation.validate(
      MasterBahanValidation.UPDATEBAHANAPPROVAL,
      request
    );

    await prismaClient.$transaction(async (tx) => {
      const bahan = await tx.masterBahan.findUnique({
        where: { id: updateBahanApprovalRequest.bahan_id },
      });

      if (!bahan) {
        throw new ResponseError(
          404,
          `Bahan dengan ID ${updateBahanApprovalRequest.bahan_id} tidak ditemukan`
        );
      }

      if (
        updateBahanApprovalRequest.status === 'Rejected' &&
        !updateBahanApprovalRequest.reason
      ) {
        throw new ResponseError(
          400,
          'Alasan harus disertakan untuk perbaikan bahan'
        );
      }

      if (
        updateBahanApprovalRequest.status !== 'Rejected' &&
        updateBahanApprovalRequest.reason
      ) {
        throw new ResponseError(
          400,
          'Alasan hanya dapat disertakan jika perubahan status bahan adalah Rejected'
        );
      }

      await tx.masterBahan.update({
        where: { id: updateBahanApprovalRequest.bahan_id },
        data: { status: updateBahanApprovalRequest.status as MasterItemStatus },
      });

      await tx.masterBahanApprovalLog.create({
        data: {
          bahan_id: updateBahanApprovalRequest.bahan_id,
          from_status: bahan.status,
          to_status: updateBahanApprovalRequest.status as MasterItemStatus,
          reason: updateBahanApprovalRequest.reason,
        },
      });

      await tx.notification.create({
        data: {
          title: `Status Bahan ${bahan.name} Diperbarui menjadi ${updateBahanApprovalRequest.status}`,
          restaurant_id: NotificationEnum.ALL,
          restaurant_name: NotificationEnum.ALL,
          bahan_id: bahan.id,
          bahan_name: bahan.name,
        },
      });
    });
  }

  static async deleteMasterBahan(
    request: DeleteMasterBahanRequest
  ): Promise<void> {
    const deleteMasterBahanRequest = Validation.validate(
      MasterBahanValidation.DELETE,
      request
    );

    const bahan = await this.checkIfBahanExists(deleteMasterBahanRequest.id);
    if (!bahan) {
      throw new ResponseError(
        404,
        `Bahan dengan ID ${deleteMasterBahanRequest.id} tidak ditemukan`
      );
    }

    await prismaClient.$transaction(async (tx) => {
      // Find all menus affected by this item's deletion
      const affectedRecipes = await tx.recipe.findMany({
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
      await tx.recipe.deleteMany({
        where: {
          item_id: deleteMasterBahanRequest.id,
          item_type: RecipeItemType.bahan,
        },
      });

      // Delete the master item
      await tx.masterBahan.delete({
        where: {
          id: deleteMasterBahanRequest.id,
        },
      });

      // Recalculate nutrition for affected menus
      for (const menuId of affectedMenuIds) {
        await RecipeService.recalculateNutritionInternal(tx, menuId);
      }
    });
  }
}
