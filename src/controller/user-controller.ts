import {Request, Response, NextFunction, request} from "express";
import {
    CreateAdminRequest,
    CreateConsumerRequest,
    CreateRestaurantRequest,
    GetUserProfileRequest, UpdateConsumerRequest, UpdateRestaurantRequest
} from "../model/user-model";
import {UserService} from "../service/user-service";
import {UserRequest} from "../type/user";

export class UserController {
    static async registerConsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateConsumerRequest = req.body as CreateConsumerRequest;
            const response = await UserService.registerConsumer(request);
            res.status(201).json({
                message: "Konsumen berhasil sign up",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async registerRestaurant(req: Request, res: Response, next: NextFunction) {
        try {
            // const requestFile = req.file;
            //
            // // Check if a file is uploaded
            // if (!requestFile) {
            //     return res.status(400).json({ errors: "No file uploaded." });
            // }
            //
            // const imageUrl = await ImageUploaderService.uploadImage(requestFile);
            //
            // const request: CreateRestaurantRequest = {
            //     ...req.body,
            //     image: imageUrl // Assuming you want to save the image URL in the request
            // } as CreateRestaurantRequest;

            const request: CreateRestaurantRequest = req.body as CreateRestaurantRequest;

            const response = await UserService.registerRestaurant(request);
            res.status(201).json({
                message: "Restoran berhasil sign up",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async registerAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateAdminRequest = req.body as CreateAdminRequest;
            const response = await UserService.registerAdmin(request);
            res.status(201).json({
                message: "Admin berhasil sign up",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getProfileConsumer(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (req.user.role == "Konsumen") {
                const response = await UserService.getProfileConsumer(req.user!);
                res.status(200).json({
                    data: response
                });
            }

            if (req.user.role == "Admin") {
                const request: GetUserProfileRequest = req.body as GetUserProfileRequest;
                request.id = String(req.params.consumerId);
                const response = await UserService.getProfileConsumer(request);
                res.status(200).json({
                    data: response
                });
            }
        } catch (e) {
            next(e);
        }
    }

    static async getProfileRestaurant(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (req.user.role == "Restoran") {
                const response = await UserService.getProfileRestaurant(req.user!);
                res.status(200).json({
                    data: response
                });
            }

            if (req.user.role == "Admin" || req.user.role == "Konsumen") {
                const request: GetUserProfileRequest = req.body as GetUserProfileRequest;
                request.id = String(req.params.restaurantId);
                const response = await UserService.getProfileRestaurant(request);
                res.status(200).json({
                    data: response
                });
            }
        } catch (e) {
            next(e);
        }
    }

    static async getConsumerInfo(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getInfoConsumer(req.user!);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAllUserConsumer(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getAllUserConsumer();
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAllUserRestaurant(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getAllUserRestaurant();
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateConsumer(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request:UpdateConsumerRequest = req.body as UpdateConsumerRequest;
            request.id = String(req.user.id);
            const response = await UserService.updateConsumer(request);
            res.status(201).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateRestaurant(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request:UpdateRestaurantRequest = req.body as UpdateRestaurantRequest;
            request.id = String(req.user.id);
            const response = await UserService.updateRestaurant(request);
            res.status(201).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}