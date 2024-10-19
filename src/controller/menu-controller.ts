import {Request, Response, NextFunction} from "express";
import {
    CreateMenuNutritionRequest,
    CreateMenuRequest,
    DeleteMenuRequest, UpdateMenuApprovalRequest,
    UpdateMenuNutritionRequest,
    UpdateMenuRequest
} from "../model/menu-model";
import {MenuService} from "../service/menu-service";
import {logger} from "../application/logging";
import {UserRequest} from "../type/user";

export class MenuController {
    static async createMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateMenuRequest = req.body as CreateMenuRequest;
            request.restaurant_id = req.user.id;
            const response = await MenuService.createMenu(request);
            res.status(201).json({
                message: "Menu berhasil ditambahkan, notifikasi terkirim kepada admin",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateMenuRequest = req.body as UpdateMenuRequest;
            request.restaurant_id = String(req.user.id);
            request.menu_id = Number(req.params.menuId);
            const response = await MenuService.updateMenu(request);
            res.status(201).json({
                message: "Menu berhasil ditambahkan, notifikasi terkirim kepada admin",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async deleteMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: DeleteMenuRequest = req.body as DeleteMenuRequest;
            request.restaurant_id = String(req.user.id);
            request.menu_id = Number(req.params.menuId);
            const response = await MenuService.deleteMenu(request);
            res.status(200).json({
                message: "Menu berhasil dihapus",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async createMenuNutrition(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateMenuNutritionRequest = req.body as CreateMenuNutritionRequest;
            request.restaurant_id = String(req.params.restaurantId);
            request.menu_id = Number(req.params.menuId);
            const response = await MenuService.createMenuNutrition(request);
            res.status(201).json({
                message: "Nutrisi menu berhasil ditambahkan",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateMenuNutrition(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateMenuNutritionRequest = req.body as UpdateMenuNutritionRequest;
            request.restaurant_id = String(req.params.restaurantId);
            request.menu_id = Number(req.params.menuId);
            const response = await MenuService.updateMenuNutrition(request);
            res.status(201).json({
                message: "Nutrisi menu berhasil diupdate",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateMenuApproval(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateMenuApprovalRequest = req.body as UpdateMenuApprovalRequest;
            request.restaurant_id = String(req.params.restaurantId);
            request.menu_id = Number(req.params.menuId);
            const response = await MenuService.updateMenuApproval(request);
            res.status(201).json({
                message: "Status menu berhasil diupdate",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }


}