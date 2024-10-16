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

export class MenuController {
    static async createMenu(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateMenuRequest = req.body as CreateMenuRequest;
            const response = await MenuService.createMenu(request);
            res.status(201).json({
                message: "Menu berhasil ditambahkan, notifikasi terkirim kepada admin",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateMenu(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateMenuRequest = req.body as UpdateMenuRequest;
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

    static async deleteMenu(req: Request, res: Response, next: NextFunction) {
        try {
            const request: DeleteMenuRequest = req.body as DeleteMenuRequest;
            request.menu_id = Number(req.params.menuId);
            const response = await MenuService.deleteMenu(request);
            res.status(200).json({
                message: "Menu berhasil dihapus",
            });
        } catch (e) {
            next(e);
        }
    }

    static async createMenuNutrition(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateMenuNutritionRequest = req.body as CreateMenuNutritionRequest;
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

    static async updateMenuNutrition(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateMenuNutritionRequest = req.body as UpdateMenuNutritionRequest;
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

    static async updateMenuApproval(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UpdateMenuApprovalRequest = req.body as UpdateMenuApprovalRequest;
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