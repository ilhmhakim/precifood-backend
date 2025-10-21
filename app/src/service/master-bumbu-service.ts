import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
  DeleteMasterBahanRequest,
  UpdateBahanApprovalRequest,
} from '../model/master-bahan-model';
import {
  CreateMasterBumbuRequest,
  GetMasterBumbuRequest,
  MasterBumbuResponse,
  toMasterBumbuResponse,
  UpdateMasterBumbuRequest,
} from '../model/master-bumbu-model';
import { NotificationEnum } from '../model/notification-model';
import { MasterBumbuValidation } from '../validation/master-bumbu-validation';
import { Validation } from '../validation/validation';
import { RecipeService } from './recipe-service';
import { MasterBumbu, MasterItemStatus, RecipeItemType } from '@prisma/client';

// TODO: recalculate nutrition performance/appraoch at update and delete could be improved
export class MasterBumbuService {
  static async checkIfBumbuExists(id: number): Promise<MasterBumbu | null> {
    const bumbu: MasterBumbu | null = await prismaClient.masterBumbu.findUnique(
      {
        where: { id },
      }
    );
    return bumbu;
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
    request: CreateMasterBumbuRequest,
    userId: string,
    userRole: string
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

    let masterBumbu;
    await prismaClient.$transaction(async (tx) => {
      masterBumbu = await tx.masterBumbu.create({
        data: createBumbuRequest,
      });

      if (userRole === 'Admin') {
        // If created by Admin, auto-approve
        await tx.masterBumbu.update({
          where: { id: masterBumbu.id },
          data: { status: MasterItemStatus.Approved },
        });

        await tx.masterBumbuApprovalLog.create({
          data: {
            bumbu_id: masterBumbu.id,
            from_status: null,
            to_status: MasterItemStatus.Approved,
            reason: `Bumbu ${masterBumbu.name} baru saja dibuat oleh Ahli Gizi dan otomatis disetujui`,
          },
        });

        await tx.notification.create({
          data: {
            title: `Bumbu Baru ${masterBumbu.name} baru saja dibuat oleh Ahli Gizi dan otomatis disetujui`,
            restaurant_id: 'AHLI_GIZI',
            restaurant_name: 'AHLI_GIZI',
            bumbu_id: masterBumbu.id,
            bumbu_name: masterBumbu.name,
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

        await tx.masterBumbuApprovalLog.create({
          data: {
            bumbu_id: masterBumbu.id,
            from_status: null,
            to_status: masterBumbu.status,
            reason: `Bumbu ${masterBumbu.name} baru saja dibuat oleh ${restaurant.Contact!.name} dan menunggu persetujuan`,
          },
        });

        await tx.notification.create({
          data: {
            title: `Bumbu baru ${masterBumbu.name} Menunggu Persetujuan`,
            restaurant_id: userId,
            restaurant_name: restaurant.Contact!.name,
            bumbu_id: masterBumbu.id,
            bumbu_name: masterBumbu.name,
          },
        });
      }
    });

    return toMasterBumbuResponse(masterBumbu!);
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
    const getMasterBumbuRequest = Validation.validate(
      MasterBumbuValidation.GET,
      request
    );

    const masterBumbu: MasterBumbu | null =
      await prismaClient.masterBumbu.findUnique({
        where: { id: getMasterBumbuRequest.id },
        include: {
          approval_logs: true,
        },
      });

    if (!masterBumbu) {
      throw new ResponseError(
        404,
        `Master Bumbu dengan ID ${getMasterBumbuRequest.id} tidak ditemukan`
      );
    }

    return toMasterBumbuResponse(masterBumbu);
  }

  static async updateMasterBumbu(
    request: UpdateMasterBumbuRequest,
    userId: string,
    userRole: string
  ): Promise<MasterBumbuResponse> {
    const updateMasterBumbuRequest = Validation.validate(
      MasterBumbuValidation.UPDATE,
      request
    );

    const bahan = await this.checkIfBumbuExists(updateMasterBumbuRequest.id);
    if (!bahan) {
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

    let updatedMasterBumbu;
    await prismaClient.$transaction(async (tx) => {
      updatedMasterBumbu = await tx.masterBumbu.update({
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
          status:
            userRole === 'Admin'
              ? MasterItemStatus.Approved
              : MasterItemStatus.Waiting, // if updated by Admin, auto-approve; else set back to waiting
        },
      });

      if (userRole === 'Restoran') {
        const restaurant = await tx.restaurant.findUnique({
          where: { restaurant_id: userId },
          include: { Contact: true },
        });

        await tx.masterBumbuApprovalLog.create({
          data: {
            bumbu_id: updateMasterBumbuRequest.id,
            from_status: bahan.status,
            to_status: MasterItemStatus.Waiting,
            reason: `Bumbu ${updatedMasterBumbu.name} diperbarui oleh Restoran dan menunggu persetujuan`,
          },
        });

        await tx.notification.create({
          data: {
            title: `Bumbu ${updatedMasterBumbu.name} Diperbarui dan Menunggu Persetujuan`,
            restaurant_id: userId,
            restaurant_name: restaurant!.Contact!.name,
            bumbu_id: updatedMasterBumbu.id,
            bumbu_name: updatedMasterBumbu.name,
          },
        });
      }

      // Recalculate nutrition for menus that use this bumbu
      const affectedRecipes = await tx.recipe.findMany({
        where: {
          item_id: updateMasterBumbuRequest.id,
          item_type: RecipeItemType.bumbu,
        },
        select: { menu_id: true },
      });
      const affectedMenuIds: Array<number> = Array.from(
        new Set(affectedRecipes.map((r) => r.menu_id))
      );

      for (const menuId of affectedMenuIds) {
        await RecipeService.recalculateNutritionInternal(tx, menuId);
      }
    });

    return toMasterBumbuResponse(updatedMasterBumbu!);
  }

  static async deleteMasterBumbu(
    request: DeleteMasterBahanRequest
  ): Promise<void> {
    const deleteMasterBumbuRequest = Validation.validate(
      MasterBumbuValidation.DELETE,
      request
    );

    const bahan = await this.checkIfBumbuExists(deleteMasterBumbuRequest.id);
    if (!bahan) {
      throw new ResponseError(
        404,
        `Bumbu dengan ID ${deleteMasterBumbuRequest.id} tidak ditemukan`
      );
    }

    // Find all menus affected
    const affectedRecipes = await prismaClient.recipe.findMany({
      where: {
        item_id: deleteMasterBumbuRequest.id,
        item_type: RecipeItemType.bumbu,
      },
      select: { menu_id: true },
    });
    const affectedMenuIds: Array<number> = Array.from(
      new Set(affectedRecipes.map((r) => r.menu_id))
    );

    // Delete recipes referencing this item
    await prismaClient.recipe.deleteMany({
      where: {
        item_id: deleteMasterBumbuRequest.id,
        item_type: RecipeItemType.bumbu,
      },
    });

    // Delete the master item
    await prismaClient.masterBumbu.delete({
      where: {
        id: deleteMasterBumbuRequest.id,
      },
    });

    // Recalculate nutrition for affected menus
    for (const menuId of affectedMenuIds) {
      await RecipeService.recalculateNutritionInternal(prismaClient, menuId);
    }
  }

  static async updateBumbuApproval(
    request: UpdateBahanApprovalRequest
  ): Promise<void> {
    const updateBumbuApprovalRequest = Validation.validate(
      MasterBumbuValidation.UPDATEBUMBUAPPROVAL,
      request
    );

    await prismaClient.$transaction(async (tx) => {
      const bumbu = await tx.masterBumbu.findUnique({
        where: { id: updateBumbuApprovalRequest.bahan_id },
      });

      if (!bumbu) {
        throw new ResponseError(
          404,
          `Bumbu dengan ID ${updateBumbuApprovalRequest.bahan_id} tidak ditemukan`
        );
      }

      if (
        updateBumbuApprovalRequest.status === 'Rejected' &&
        !updateBumbuApprovalRequest.reason
      ) {
        throw new ResponseError(
          400,
          'Alasan harus disertakan untuk penolakan bumbu'
        );
      }

      if (
        updateBumbuApprovalRequest.status !== 'Rejected' &&
        updateBumbuApprovalRequest.reason
      ) {
        throw new ResponseError(
          400,
          'Alasan hanya dapat disertakan jika perubahan status bumbu adalah Rejected'
        );
      }

      await tx.masterBumbu.update({
        where: { id: updateBumbuApprovalRequest.bahan_id },
        data: { status: updateBumbuApprovalRequest.status as MasterItemStatus },
      });

      await tx.masterBumbuApprovalLog.create({
        data: {
          bumbu_id: updateBumbuApprovalRequest.bahan_id,
          from_status: bumbu.status,
          to_status: updateBumbuApprovalRequest.status as MasterItemStatus,
          reason: updateBumbuApprovalRequest.reason,
        },
      });

      await tx.notification.create({
        data: {
          title: `Status Bumbu ${bumbu.name} Diperbarui menjadi ${updateBumbuApprovalRequest.status}`,
          restaurant_id: NotificationEnum.ALL,
          restaurant_name: NotificationEnum.ALL,
          bumbu_id: bumbu.id,
          bumbu_name: bumbu.name,
        },
      });
    });
  }
}
