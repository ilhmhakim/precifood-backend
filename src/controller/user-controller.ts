import {Request, Response, NextFunction, request} from "express";
import {
    CreateAdminRequest,
    CreateConsumerRequest,
    CreateRestaurantRequest,
    GetUserProfileRequest, UpdateConsumerRequest, UpdateRestaurantRequest
} from "../model/user-model";
import {UserService} from "../service/user-service";
import {UserRequest} from "../type/user";
import {ImageUploaderService} from "../service/image-uploader-service";

export class UserController {
    static async registerConsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateConsumerRequest = req.body as CreateConsumerRequest;
            const response = await UserService.registerConsumer(request);
            res.status(201).json({
                message: "Success!",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async registerRestaurant(req: Request, res: Response, next: NextFunction) {
        try {
            const requestFile = req.file;

            console.log("File received:", req.file);
            console.log("Request body:", req.body);

            const imageUrl = await ImageUploaderService.uploadImage(requestFile, 'restaurant-profiles-images');

            const request: CreateRestaurantRequest = {
                ...req.body,
                image_url: imageUrl // Assuming you want to save the image URL in the request
            } as CreateRestaurantRequest;


            const response = await UserService.registerRestaurant(request);
            res.status(201).json({
                message: "Success!",
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
                    message: "Success!",
                    data: response
                });
            }

            if (req.user.role == "Admin") {
                const request: GetUserProfileRequest = req.body as GetUserProfileRequest;
                request.id = String(req.params.consumerId);
                const response = await UserService.getProfileConsumer(request);
                res.status(200).json({
                    message: "Success!",
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
                    message: "Success!",
                    data: response
                });
            }

            if (req.user.role == "Admin" || req.user.role == "Konsumen") {
                const request: GetUserProfileRequest = req.body as GetUserProfileRequest;
                request.id = String(req.params.restaurantId);
                const response = await UserService.getProfileRestaurant(request);
                res.status(200).json({
                    message: "Success!",
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
                message: "Success!",
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
                message: "Success!",
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
                message: "Success!",
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
                message: "Success!",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateRestaurant(req: UserRequest, res: Response, next: NextFunction) {
        try {
            let imageUrl;
            if (req.file) {
                // Hanya update image jika ada file yang diunggah
                imageUrl = await ImageUploaderService.uploadImage(req.file, 'restaurant-profiles-images');
            }

            const request: UpdateRestaurantRequest = {
                ...req.body, // Mengambil hanya field yang diubah dari req.body
                id: String(req.user.id),
                image_url: imageUrl || req.body.image_url, // Hanya update jika imageUrl ada
            };

            await UserService.updateRestaurant(request);
            res.status(200).json({
                message: "Success!"
            });
        } catch (e) {
            next(e);
        }
    }

}