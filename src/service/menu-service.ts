import {UserRequest} from "../type/user";
import {
    CreateMenuNutritionRequest,
    CreateMenuRequest,
    DeleteMenuRequest, MenuNutritionResponse,
    MenuResponse, toMenuDetailResponse,
    toMenuResponse, UpdateMenuApprovalRequest, UpdateMenuNutritionRequest,
    UpdateMenuRequest
} from "../model/menu-model";
import {Menu, MenuStatus} from "@prisma/client";
import {Validation} from "../validation/validation";
import {MenuValidation} from "../validation/menu-validation";
import {prismaClient} from "../application/database";
import {logger} from "../application/logging";

export class MenuService {

    static async createMenu(request: CreateMenuRequest): Promise<MenuResponse> {
        let createMenuRequest = Validation.validate(MenuValidation.CREATEMENU, request);

        const menu = await prismaClient.menu.create({
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

        const restaurantInformation = await prismaClient.contact.findFirst({
            where: {
                restaurant_id: createMenuRequest.restaurant_id,
            }
        });

       await prismaClient.notification.create({
            data: {
                title: "Menu baru ditambahkan!",
                restaurant_name: String(restaurantInformation.name),
                restaurant_id: createMenuRequest.restaurant_id,
                menu_id: menu.id,
                menu_name: createMenuRequest.name
            }
        })
        return toMenuResponse(menu)
    }

    static async updateMenu(request: UpdateMenuRequest): Promise<MenuResponse> {
        const updateMenuRequest = Validation.validate(MenuValidation.UPDATEMENU, request);
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

        const menu = await prismaClient.menu.delete({
           where: {
               id: deleteRequest.menu_id,
               restaurant_id: deleteRequest.restaurant_id,
           }
        });

        return toMenuResponse(menu);
    }

    static async createMenuNutrition(request: CreateMenuNutritionRequest): Promise<MenuResponse> {
        const createMenuNutritionRequest: CreateMenuNutritionRequest = Validation.validate(MenuValidation.CREATEMENUNUTRITION, request);

        const menu = await prismaClient.menu.findFirst({
            where: {
                id: createMenuNutritionRequest.menu_id
            }
        });

        const nutrition = await prismaClient.nutrition.create({
            data: {
                menu_id: createMenuNutritionRequest.menu_id,
                weight_per_portion: createMenuNutritionRequest.weight_per_portion,
                calory: createMenuNutritionRequest.calory,
                protein: createMenuNutritionRequest.protein,
                fat: createMenuNutritionRequest.fat,
                carbohydrate: createMenuNutritionRequest.carbohydrate,
                sodium: createMenuNutritionRequest.sodium,
                cholesterol: createMenuNutritionRequest.cholesterol,
                sfa: createMenuNutritionRequest.sfa,
                mufa: createMenuNutritionRequest.mufa,
                pufa: createMenuNutritionRequest.pufa
            }
        });

        return toMenuDetailResponse(menu!, nutrition);
    }

    static async updateMenuNutrition(request: UpdateMenuNutritionRequest): Promise<MenuResponse> {
        const updateMenuNutritionRequest: UpdateMenuNutritionRequest = Validation.validate(MenuValidation.UPDATEMENUNUTRITION, request);

        const menu = await prismaClient.menu.findFirst({
            where: {
                id: updateMenuNutritionRequest.menu_id
            }
        });

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
                sodium: updateMenuNutritionRequest.sodium,
                cholesterol: updateMenuNutritionRequest.cholesterol,
                sfa: updateMenuNutritionRequest.sfa,
                mufa: updateMenuNutritionRequest.mufa,
                pufa: updateMenuNutritionRequest.pufa
            }
        });

        return toMenuDetailResponse(menu!, nutrition);
    }

    static async updateMenuApproval(request: UpdateMenuApprovalRequest): Promise<MenuResponse> {
        const updateMenuApprovalRequest: UpdateMenuApprovalRequest = Validation.validate(MenuValidation.UPDATEMENUAPPROVAL, request);

        await prismaClient.menu.update({
            where: {
                id: updateMenuApprovalRequest.menu_id,
            },
            data: {
                status: updateMenuApprovalRequest.status
            }
        });

        const menu = await prismaClient.menu.findFirst({
            where: {
                id: updateMenuApprovalRequest.menu_id
            }
        });

        return toMenuResponse(menu!);
    }
}
