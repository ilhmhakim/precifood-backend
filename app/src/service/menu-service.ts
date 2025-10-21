import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
  AllMenusResponse,
  CreateMenuNutritionRequest,
  CreateMenuRequest,
  DeleteMenuRequest,
  GetAllMenuRequest,
  GetMenuDetailRequest,
  MenuDetailResponse,
  NutritionPerPortion,
  SearchMenuRequest,
  toAllMenusResponse,
  toMenuDetailResponse,
  UpdateMenuApprovalRequest,
  UpdateMenuNutritionRequest,
  UpdateMenuRequest,
} from '../model/menu-model';
import { MenuValidation } from '../validation/menu-validation';
import { Validation } from '../validation/validation';
import { MenuApprovalLog, MenuStatus, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class MenuService {
  static async checkRestaurantExist(restaurantId: string) {
    const restaurant = await prismaClient.restaurant.findFirst({
      where: {
        restaurant_id: restaurantId,
      },
      include: {
        user: true,
        Contact: true,
        Address: true,
      },
    });

    if (!restaurant) {
      throw new ResponseError(
        404,
        `Tidak ditemukan restoran dengan ID ${restaurantId}`
      );
    }

    return restaurant;
  }

  static async checkMenuExist(menuId: number, restaurantId: string) {
    const menu = await prismaClient.menu.findFirst({
      where: {
        id: menuId,
        restaurant_id: restaurantId,
      },
      include: {
        restaurant: {
          include: {
            Contact: true,
          },
        },
        Nutrition: true,
      },
    });

    if (!menu) {
      throw new ResponseError(
        404,
        `Tidak ditemukan menu dengan ID ${menuId} pada restaurant ID ${restaurantId}`
      );
    }

    return menu;
  }

  static async createMenu(request: CreateMenuRequest) {
    const createMenuRequest = Validation.validate(
      MenuValidation.CREATEMENU,
      request
    );
    const restaurant = await this.checkRestaurantExist(
      createMenuRequest.restaurant_id
    );

    await prismaClient.$transaction(async (prisma) => {
      const menu = await prisma.menu.create({
        data: {
          restaurant_id: createMenuRequest.restaurant_id,
          name: createMenuRequest.name,
          category: createMenuRequest.category,
          price: createMenuRequest.price,
          portion: createMenuRequest.portion,
          description: createMenuRequest.description,
          image_url: createMenuRequest.image_url,
          status: 'Waiting',
        },
      });

      // Buat notifikasi menu baru
      await prisma.notification.create({
        data: {
          title: `Menu baru ${menu.name} oleh ${restaurant.Contact!.name} ditambahkan!`,
          restaurant_name: restaurant.Contact!.name,
          restaurant_id: createMenuRequest.restaurant_id,
          menu_id: menu.id,
          menu_name: createMenuRequest.name,
        },
      });

      await prisma.menuApprovalLog.create({
        data: {
          menu_id: menu.id,
          reason: 'Menu baru dibuat dan menunggu persetujuan',
          from_status: null,
          to_status: 'Waiting',
        },
      });
    });
  }

  static async updateMenu(request: UpdateMenuRequest) {
    const updateMenuRequest = Validation.validate(
      MenuValidation.UPDATEMENU,
      request
    );
    await this.checkRestaurantExist(updateMenuRequest.restaurant_id);
    await this.checkMenuExist(
      updateMenuRequest.menu_id,
      updateMenuRequest.restaurant_id
    );

    await prismaClient.menu.update({
      where: {
        id: updateMenuRequest.menu_id,
        restaurant_id: updateMenuRequest.restaurant_id,
      },
      data: {
        name: updateMenuRequest.name,
        category: updateMenuRequest.category,
        price: updateMenuRequest.price,
        portion: updateMenuRequest.portion,
        description: updateMenuRequest.description,
        image_url: updateMenuRequest.image_url,
      },
    });
  }

  static async deleteMenu(request: DeleteMenuRequest) {
    const deleteRequest = Validation.validate(
      MenuValidation.DELETEMENU,
      request
    );
    await this.checkRestaurantExist(deleteRequest.restaurant_id);
    await this.checkMenuExist(
      deleteRequest.menu_id,
      deleteRequest.restaurant_id
    );

    await prismaClient.menu.delete({
      where: {
        id: deleteRequest.menu_id,
        restaurant_id: deleteRequest.restaurant_id,
      },
    });
  }

  static async createMenuNutrition(request: CreateMenuNutritionRequest) {
    const createMenuNutritionRequest = Validation.validate(
      MenuValidation.CREATEMENUNUTRITION,
      request
    );
    await this.checkMenuExist(
      createMenuNutritionRequest.menu_id,
      createMenuNutritionRequest.restaurant_id
    );

    await prismaClient.nutrition.create({
      data: {
        menu_id: createMenuNutritionRequest.menu_id,
        weight_per_portion: createMenuNutritionRequest.weight_per_portion,
        weight_with_bdd: createMenuNutritionRequest.weight_with_bdd,
        calory: createMenuNutritionRequest.calory,
        protein: new Decimal(createMenuNutritionRequest.protein),
        fat: new Decimal(createMenuNutritionRequest.fat),
        carbohydrate: new Decimal(createMenuNutritionRequest.carbohydrate),
        fiber: new Decimal(createMenuNutritionRequest.fiber),
        natrium: new Decimal(createMenuNutritionRequest.natrium),
        cholesterol: new Decimal(createMenuNutritionRequest.cholesterol),
        sfa: new Decimal(createMenuNutritionRequest.sfa),
        mufa: new Decimal(createMenuNutritionRequest.mufa),
        pufa: new Decimal(createMenuNutritionRequest.pufa),
      },
    });
  }

  static async updateMenuNutrition(request: UpdateMenuNutritionRequest) {
    const updateMenuNutritionRequest: UpdateMenuNutritionRequest =
      Validation.validate(MenuValidation.UPDATEMENUNUTRITION, request);
    await this.checkMenuExist(
      updateMenuNutritionRequest.menu_id,
      updateMenuNutritionRequest.restaurant_id
    );

    await prismaClient.nutrition.update({
      where: {
        menu_id: updateMenuNutritionRequest.menu_id,
      },
      data: {
        weight_per_portion: updateMenuNutritionRequest.weight_per_portion,
        weight_with_bdd: updateMenuNutritionRequest.weight_with_bdd,
        calory: updateMenuNutritionRequest.calory,
        protein: updateMenuNutritionRequest.protein,
        fat: updateMenuNutritionRequest.fat,
        carbohydrate: updateMenuNutritionRequest.carbohydrate,
        fiber: updateMenuNutritionRequest.fiber,
        natrium: updateMenuNutritionRequest.natrium,
        cholesterol: updateMenuNutritionRequest.cholesterol,
        sfa: updateMenuNutritionRequest.sfa,
        mufa: updateMenuNutritionRequest.mufa,
        pufa: updateMenuNutritionRequest.pufa,
      },
    });
  }

  static async updateMenuApproval(request: UpdateMenuApprovalRequest) {
    const updateMenuApprovalRequest = Validation.validate(
      MenuValidation.UPDATEMENUAPPROVAL,
      request
    );

    const menu = await this.checkMenuExist(
      updateMenuApprovalRequest.menu_id,
      updateMenuApprovalRequest.restaurant_id
    );

    if (
      updateMenuApprovalRequest.status === 'Rejected' &&
      !updateMenuApprovalRequest.reason
    ) {
      throw new ResponseError(
        400,
        'Alasan harus disertakan untuk perbaikan menu'
      );
    }

    if (
      updateMenuApprovalRequest.status !== 'Rejected' &&
      updateMenuApprovalRequest.reason
    ) {
      throw new ResponseError(
        400,
        'Alasan hanya dapat disertakan jika status menu adalah Rejected'
      );
    }

    await prismaClient.$transaction(async (tx) => {
      await tx.menuApprovalLog.create({
        data: {
          menu_id: updateMenuApprovalRequest.menu_id,
          reason: updateMenuApprovalRequest.reason ?? null,
          from_status: menu.status as MenuStatus,
          to_status: updateMenuApprovalRequest.status as MenuStatus,
        },
      });

      await tx.menu.update({
        where: {
          id: updateMenuApprovalRequest.menu_id,
        },
        data: {
          status: updateMenuApprovalRequest.status,
        },
      });

      await tx.notification.create({
        data: {
          title: `Status Menu ${menu.name} telah menjadi ${updateMenuApprovalRequest.status}`,
          restaurant_name: menu.restaurant.Contact!.name,
          restaurant_id: updateMenuApprovalRequest.restaurant_id,
          menu_id: updateMenuApprovalRequest.menu_id,
          menu_name: menu.name,
        },
      });
    });
  }

  static async getAllRestaurantMenu(
    request: GetAllMenuRequest
  ): Promise<Array<AllMenusResponse>> {
    const requestGetAllRestaurantMenu = Validation.validate(
      MenuValidation.GETALLMENU,
      request
    );

    await this.checkRestaurantExist(requestGetAllRestaurantMenu.restaurant_id);

    let menuQuery: any = {
      where: {
        restaurant_id: requestGetAllRestaurantMenu.restaurant_id,
      },
      orderBy: { name: 'asc' },
    };

    if (requestGetAllRestaurantMenu.role === 'Konsumen') {
      menuQuery.where.status = 'Approved';
    }

    const menus = await prismaClient.menu.findMany(menuQuery);

    if (menus.length === 0) {
      throw new ResponseError(404, 'Belum ada menu yang tersedia');
    }

    return menus.map((menu) => toAllMenusResponse(menu));
  }

  static async getMenuDetail(
    request: GetMenuDetailRequest
  ): Promise<MenuDetailResponse> {
    const requestMenuDetail: GetMenuDetailRequest = Validation.validate(
      MenuValidation.GETMENUDETAIL,
      request
    );

    await this.checkRestaurantExist(requestMenuDetail.restaurant_id);
    const menu = await this.checkMenuExist(
      requestMenuDetail.menu_id,
      requestMenuDetail.restaurant_id
    );

    if (menu.status !== 'Approved' && requestMenuDetail.role === 'Konsumen') {
      throw new ResponseError(403, 'Belum dapat mengakses menu');
    }

    const nutrition = menu.Nutrition;
    const nutritionPerPortion: NutritionPerPortion = {
      weight_per_portion: nutrition?.weight_per_portion,
      weight_with_bdd: nutrition?.weight_with_bdd,
      calory:
        nutrition?.calory &&
        new Prisma.Decimal(nutrition.calory.toNumber()).div(menu.portion),
      protein:
        nutrition?.protein &&
        new Prisma.Decimal(nutrition.protein.toNumber()).div(menu.portion),
      fat:
        nutrition?.fat &&
        new Prisma.Decimal(nutrition.fat.toNumber()).div(menu.portion),
      carbohydrate:
        nutrition?.carbohydrate &&
        new Prisma.Decimal(nutrition.carbohydrate.toNumber()).div(menu.portion),
      fiber:
        nutrition?.fiber &&
        new Prisma.Decimal(nutrition.fiber.toNumber()).div(menu.portion),
      natrium:
        nutrition?.natrium &&
        new Prisma.Decimal(nutrition.natrium.toNumber()).div(menu.portion),
      cholesterol:
        nutrition?.cholesterol &&
        new Prisma.Decimal(nutrition.cholesterol.toNumber()).div(menu.portion),
      sfa:
        nutrition?.sfa &&
        new Prisma.Decimal(nutrition.sfa.toNumber()).div(menu.portion),
      mufa:
        nutrition?.mufa &&
        new Prisma.Decimal(nutrition.mufa.toNumber()).div(menu.portion),
      pufa:
        nutrition?.pufa &&
        new Prisma.Decimal(nutrition.pufa.toNumber()).div(menu.portion),
    };

    let menuApprovalLogs: MenuApprovalLog[] | null = null;
    if (requestMenuDetail.role !== 'Konsumen') {
      menuApprovalLogs = await prismaClient.menuApprovalLog.findMany({
        where: {
          menu_id: requestMenuDetail.menu_id,
        },
        orderBy: {
          changed_at: 'desc',
        },
      });
    }

    // Mengirimkan `null` untuk `nutrition` jika tidak ada data `Nutrition`
    // Mengirimkan `null` untuk `nutritionPerPortion` jika tidak ada data `NutritionPerPortion`
    return toMenuDetailResponse(
      menu,
      menu.Nutrition || null,
      nutritionPerPortion || null,
      requestMenuDetail.role,
      menuApprovalLogs
    );
  }

  static async searchMenu(
    request: SearchMenuRequest
  ): Promise<Array<AllMenusResponse>> {
    // Validasi input
    const requestSearchMenu = Validation.validate(
      MenuValidation.SEARCHMENU,
      request
    );

    // Cek apakah restoran ada
    await this.checkRestaurantExist(requestSearchMenu.restaurant_id);

    const filters: any[] = [];

    // Tambahkan filter nama jika tersedia
    if (requestSearchMenu.name) {
      filters.push({
        name: {
          contains: requestSearchMenu.name,
          mode: 'insensitive', // Pencarian tidak peka huruf besar-kecil
        },
      });
    }

    // Tambahkan filter kategori jika tersedia
    if (requestSearchMenu.category) {
      filters.push({
        category: requestSearchMenu.category,
      });
    }

    // Konsumen tidak diperbolehkan mencari berdasarkan status
    if (requestSearchMenu.role === 'Konsumen') {
      filters.push({
        status: 'Approved', // Konsumen hanya bisa melihat menu yang disetujui
      });
    } else if (requestSearchMenu.status) {
      // Tambahkan filter status jika tersedia dan pengguna bukan Konsumen
      filters.push({
        status: requestSearchMenu.status,
      });
    }

    // Siapkan default orderBy untuk harga (desc)
    let orderByPrice: 'asc' | 'desc' = 'desc';

    // Cek apakah pengguna mengirim parameter `price` untuk pengurutan
    if (
      requestSearchMenu.price === 'asc' ||
      requestSearchMenu.price === 'desc'
    ) {
      orderByPrice = requestSearchMenu.price as 'asc' | 'desc';
    }

    // Query Prisma untuk mencari menu
    const menus = await prismaClient.menu.findMany({
      where: {
        restaurant_id: requestSearchMenu.restaurant_id,
        AND: filters.length > 0 ? filters : undefined, // Filter tambahan jika ada
      },
      orderBy: {
        price: orderByPrice, // Urutkan berdasarkan harga sesuai dengan query
      },
    });

    // Mengembalikan error jika tidak ada menu yang ditemukan
    if (menus.length === 0) {
      throw new ResponseError(404, 'Menu tidak ditemukan');
    }

    // Mengubah hasil query menjadi array MenuResponse
    return menus.map((menu) => toAllMenusResponse(menu));
  }
}
