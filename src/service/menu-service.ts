import {UserRequest} from "../type/user";
import {
    CreateMenuNutritionRequest,
    CreateMenuRequest,
    DeleteMenuRequest, GetAllMenuRequest, GetMenuDetailRequest,
    MenuResponse, SearchMenuRequest, toMenuDetailResponse,
    toMenuResponse, UpdateMenuApprovalRequest, UpdateMenuNutritionRequest,
    UpdateMenuRequest
} from "../model/menu-model";
import {Address, Contact, Menu, Nutrition, Prisma} from "@prisma/client";
import {Validation} from "../validation/validation";
import {MenuValidation} from "../validation/menu-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Decimal} from "@prisma/client/runtime/library";

export class MenuService {

    static async checkRestaurantExist(restaurantId: string): Promise<{contact: Contact, address: Address}> {
        const restaurant = await prismaClient.restaurant.findFirst({
            where: {
                restaurant_id: restaurantId,
            },
            include: {
                Contact: true,  // Sertakan relasi Contact
                Address: true   // Sertakan relasi Address
            }
        });

        // Jika restoran tidak ditemukan
        if (!restaurant) {
            throw new ResponseError(404, `Tidak ditemukan restoran dengan ID ${restaurantId}`);
        }

        // Destrukturisasi objek restaurant untuk mendapatkan Contact dan Address
        const { Contact, Address } = restaurant;

        // Kembalikan Contact dan Address sebagai objek
        return { contact: Contact!, address: Address! };
    }



    static async checkMenuExist(menuId: number, restaurantId: string): Promise<{menu: Menu, nutrition: Nutrition}> {
        const menu = await prismaClient.menu.findFirst({
            where: {
                id: menuId,
                restaurant_id: restaurantId
            },
            include: {
                Nutrition: true
            }
        });

        if (!menu) {
            throw new ResponseError(404, `Tidak ditemukan menu dengan ID ${menuId} pada restaurant ID ${restaurantId}`);
        }

        const { Nutrition } = menu;
        return { menu, nutrition: Nutrition! };
    }

    static async createMenu(request: CreateMenuRequest): Promise<MenuResponse> {
        const createMenuRequest = Validation.validate(MenuValidation.CREATEMENU, request);
        const checkRestaurantExist = await this.checkRestaurantExist(createMenuRequest.restaurant_id);

        const menuResponse = await prismaClient.$transaction(async (prisma) => {
            const menu = await prisma.menu.create({
                data: {
                    restaurant_id: createMenuRequest.restaurant_id,
                    name: createMenuRequest.name,
                    category: createMenuRequest.category,
                    price: createMenuRequest.price,
                    portion: createMenuRequest.portion,
                    description: createMenuRequest.description,
                    image_url: createMenuRequest.image_url,
                }
            });

            // Buat notifikasi menu baru
            await prisma.notification.create({
                data: {
                    title: "Menu baru ditambahkan!",
                    restaurant_name: checkRestaurantExist.contact.name,
                    restaurant_id: createMenuRequest.restaurant_id,
                    menu_id: menu.id,
                    menu_name: createMenuRequest.name
                }
            });

            return toMenuResponse(menu);
        });

        return menuResponse;
    }

    static async updateMenu(request: UpdateMenuRequest): Promise<MenuResponse> {
        const updateMenuRequest = Validation.validate(MenuValidation.UPDATEMENU, request);
        await this.checkRestaurantExist(updateMenuRequest.restaurant_id);
        await this.checkMenuExist(updateMenuRequest.menu_id, updateMenuRequest.restaurant_id);

        const menu = await prismaClient.menu.update({
            where: {
                id: updateMenuRequest.menu_id,
                restaurant_id: updateMenuRequest.restaurant_id,
            }, data: {
                name: updateMenuRequest.name,
                category: updateMenuRequest.category,
                price: updateMenuRequest.price,
                portion: updateMenuRequest.portion,
                description: updateMenuRequest.description,
                image_url: updateMenuRequest.image_url,
            }
        });

        return toMenuResponse(menu);
    }

    static async deleteMenu(request: DeleteMenuRequest) {
        const deleteRequest = Validation.validate(MenuValidation.DELETEMENU, request);
        await this.checkRestaurantExist(deleteRequest.restaurant_id);
        await this.checkMenuExist(deleteRequest.menu_id, deleteRequest.restaurant_id);

        const menu = await prismaClient.menu.delete({
           where: {
               id: deleteRequest.menu_id,
               restaurant_id: deleteRequest.restaurant_id,
           }
        });

        return toMenuResponse(menu);
    }

    static async createMenuNutrition(request: CreateMenuNutritionRequest): Promise<MenuResponse> {
        const createMenuNutritionRequest = Validation.validate(MenuValidation.CREATEMENUNUTRITION, request);
        const checkMenuExist = await this.checkMenuExist(createMenuNutritionRequest.menu_id, createMenuNutritionRequest.restaurant_id);

        const nutrition = await prismaClient.nutrition.create({
            data: {
                menu_id: createMenuNutritionRequest.menu_id,
                weight_per_portion: createMenuNutritionRequest.weight_per_portion,
                weight_with_bdd: createMenuNutritionRequest.weight_with_bdd,
                calory: createMenuNutritionRequest.calory,
                protein: new Decimal(createMenuNutritionRequest.protein),  // Convert number to Decimal
                fat: new Decimal(createMenuNutritionRequest.fat),          // Convert number to Decimal
                carbohydrate: new Decimal(createMenuNutritionRequest.carbohydrate),
                fiber: new Decimal(createMenuNutritionRequest.fiber),
                natrium: new Decimal(createMenuNutritionRequest.natrium),
                cholesterol: new Decimal(createMenuNutritionRequest.cholesterol),
                sfa: new Decimal(createMenuNutritionRequest.sfa),
                mufa: new Decimal(createMenuNutritionRequest.mufa),
                pufa: new Decimal(createMenuNutritionRequest.pufa),
            }
        });

        return toMenuDetailResponse(checkMenuExist.menu, nutrition);
    }

    static async updateMenuNutrition(request: UpdateMenuNutritionRequest): Promise<MenuResponse> {
        const updateMenuNutritionRequest: UpdateMenuNutritionRequest = Validation.validate(MenuValidation.UPDATEMENUNUTRITION, request);
        const checkMenuExist = await this.checkMenuExist(updateMenuNutritionRequest.menu_id, updateMenuNutritionRequest.restaurant_id);

        const nutrition = await prismaClient.nutrition.update({
            where: {
                menu_id: updateMenuNutritionRequest.menu_id
            },
            data: {
                weight_per_portion: updateMenuNutritionRequest.weight_per_portion,
                calory: updateMenuNutritionRequest.calory,
                protein: updateMenuNutritionRequest.protein,
                fat: updateMenuNutritionRequest.fat,
                carbohydrate: updateMenuNutritionRequest.carbohydrate,
                fiber: updateMenuNutritionRequest.fiber,
                natrium: updateMenuNutritionRequest.natrium,
                cholesterol: updateMenuNutritionRequest.cholesterol,
                sfa: updateMenuNutritionRequest.sfa,
                mufa: updateMenuNutritionRequest.mufa,
                pufa: updateMenuNutritionRequest.pufa
            }
        });

        return toMenuDetailResponse(checkMenuExist.menu, nutrition);
    }

    static async updateMenuApproval(request: UpdateMenuApprovalRequest): Promise<MenuResponse> {
        const updateMenuApprovalRequest = Validation.validate(MenuValidation.UPDATEMENUAPPROVAL, request);

        const menu = await prismaClient.menu.update({
            where: {
                id: updateMenuApprovalRequest.menu_id,
            },
            data: {
                status: updateMenuApprovalRequest.status
            }
        });

        return toMenuResponse(menu!);
    }

    static async getAllRestaurantMenu(request: GetAllMenuRequest): Promise<Array<MenuResponse>> {
        const requestGetAllRestaurantMenu = Validation.validate(MenuValidation.GETALLMENU, request);

        await this.checkRestaurantExist(requestGetAllRestaurantMenu.restaurant_id);

        let menuQuery: any = {
            where: {
                restaurant_id: requestGetAllRestaurantMenu.restaurant_id,
            }
        };

        if (requestGetAllRestaurantMenu.role === "Konsumen") {
            menuQuery.where.status = "Approved";
        }

        const menus = await prismaClient.menu.findMany(menuQuery);

        if (menus.length === 0) {
            throw new ResponseError(404, "Belum ada menu yang tersedia");
        }

        return menus.map((menu) => toMenuResponse(menu));
    }

    static async getMenuDetail(request: GetMenuDetailRequest): Promise<MenuResponse> {
        const requestMenuDetail: GetMenuDetailRequest = Validation.validate(MenuValidation.GETMENUDETAIL, request);

        await this.checkRestaurantExist(requestMenuDetail.restaurant_id);
        const menu = await this.checkMenuExist(requestMenuDetail.menu_id, requestMenuDetail.restaurant_id);

        return toMenuDetailResponse(menu.menu, menu.nutrition);
    }

    static async searchMenu(request: SearchMenuRequest): Promise<Array<MenuResponse>> {
        // Validasi input
        const requestSearchMenu = Validation.validate(MenuValidation.SEARCHMENU, request);

        // Cek apakah restoran ada
        await this.checkRestaurantExist(requestSearchMenu.restaurant_id);

        const filters: any[] = [];

        // Tambahkan filter nama jika tersedia
        if (requestSearchMenu.name) {
            filters.push({
                name: {
                    contains: requestSearchMenu.name,
                    mode: 'insensitive'  // Pencarian tidak peka huruf besar-kecil
                }
            });
        }

        // Tambahkan filter kategori jika tersedia
        if (requestSearchMenu.category) {
            filters.push({
                category: requestSearchMenu.category
            });
        }

        // Konsumen tidak diperbolehkan mencari berdasarkan status
        if (requestSearchMenu.role === "Konsumen") {
            filters.push({
                status: "Approved"  // Konsumen hanya bisa melihat menu yang disetujui
            });
        } else if (requestSearchMenu.status) {
            // Tambahkan filter status jika tersedia dan pengguna bukan Konsumen
            filters.push({
                status: requestSearchMenu.status
            });
        }

        // Siapkan default orderBy untuk harga (desc)
        let orderByPrice: 'asc' | 'desc' = 'desc';

        // Cek apakah pengguna mengirim parameter `price` untuk pengurutan
        if (requestSearchMenu.price === 'asc' || requestSearchMenu.price === 'desc') {
            orderByPrice = requestSearchMenu.price as 'asc' | 'desc';
        }

        // Query Prisma untuk mencari menu
        const menus = await prismaClient.menu.findMany({
            where: {
                restaurant_id: requestSearchMenu.restaurant_id,
                AND: filters.length > 0 ? filters : undefined // Filter tambahan jika ada
            },
            orderBy: {
                price: orderByPrice  // Urutkan berdasarkan harga sesuai dengan query
            }
        });

        // Mengembalikan error jika tidak ada menu yang ditemukan
        if (menus.length === 0) {
            throw new ResponseError(404, "Menu tidak ditemukan");
        }

        // Mengubah hasil query menjadi array MenuResponse
        return menus.map((menu) => toMenuResponse(menu));
    }
}
