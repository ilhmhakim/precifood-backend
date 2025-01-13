import {Request, Response, NextFunction} from "express";
import {
    CreateMenuNutritionRequest,
    CreateMenuRequest,
    DeleteMenuRequest,
    GetAllMenuRequest, GetMenuDetailRequest, SearchMenuRequest,
    UpdateMenuApprovalRequest,
    UpdateMenuNutritionRequest,
    UpdateMenuRequest
} from "../model/menu-model";
import {MenuService} from "../service/menu-service";
import {UserRequest} from "../type/user";
import {ImageUploaderService} from "../service/image-uploader-service";

export class MenuController {
    static async createMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const imageUrl = await ImageUploaderService.uploadImage(file, "menu-images");

            const request: CreateMenuRequest = {
                ...req.body,
                restaurant_id: req.user.id,
                image_url: imageUrl
            } as CreateMenuRequest;

            await MenuService.createMenu(request);

            res.status(201).json({
                message: "Success!",
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            let imageUrl;
            if(req.file){
                imageUrl = await ImageUploaderService.uploadImage(req.file, "menu-images");
            }

            const request: UpdateMenuRequest = {
                ...req.body,
                restaurant_id: String(req.user.id),
                menu_id: Number(req.params.menuId),
                image_url: imageUrl || req.body.image_url,
            };

            await MenuService.updateMenu(request);

            res.status(200).json({
                message: "Success!"
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

            await MenuService.deleteMenu(request);

            res.status(200).json({
                message: "Success!"
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

            await MenuService.createMenuNutrition(request);

            res.status(201).json({
                message: "Success!",
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

            await MenuService.updateMenuNutrition(request);

            res.status(200).json({
                message: "Success!"
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

            await MenuService.updateMenuApproval(request);

            res.status(200).json({
                message: "Success!",
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAllRestaurantMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const requestRole = String(req.user.role);
            const requestRestaurantId = requestRole === "Restoran" ? String(req.user.id) : String(req.params.restaurantId);

            const request: GetAllMenuRequest = {
                restaurant_id: requestRestaurantId,
                role: requestRole
            };

            const response = await MenuService.getAllRestaurantMenu(request);

            res.status(200).json({
                message: "Success!",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getMenuDetail(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const requestRole = String(req.user.role);
            const requestRestaurantId = requestRole === "Restoran" ? String(req.user.id) : String(req.params.restaurantId);
            const requestMenuId = Number(req.params.menuId);

            const request: GetMenuDetailRequest = {
                restaurant_id: requestRestaurantId,
                menu_id: requestMenuId,
                role: requestRole
            };

            const response = await MenuService.getMenuDetail(request);
            res.status(200).json({
                message: "Success!",
                data: response
            });

        } catch (e) {
            next(e);
        }
    }

    static async searchMenu(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const requestRole = String(req.user.role);
            const requestRestaurantId = requestRole === "Restoran" ? String(req.user.id) : String(req.params.restaurantId);

            if (requestRole == "Konsumen" && req.query.status) {
                req.query.status = "Approved";
            }

            const request: SearchMenuRequest = {
                restaurant_id: requestRestaurantId,
                role: requestRole,
                name: req.query.name ? String(req.query.name) : undefined,
                category: req.query.category ? String(req.query.category) : undefined,
                status: req.query.status ? String(req.query.status) : undefined,
                price: req.query.price ? String(req.query.price).toLowerCase() : undefined,  // Lowercase untuk handling asc/desc
            };

            const response = await MenuService.searchMenu(request);
            res.status(200).json({
                message: "Success!",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}