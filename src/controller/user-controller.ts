import {Request, Response, NextFunction} from "express";
import {CreateConsumerRequest, CreateRestaurantRequest} from "../model/user-model";
import {UserService} from "../service/user-service";
import {UserRequest} from "../type/user";

export class UserController {
    static async registerConsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateConsumerRequest = req.body as CreateConsumerRequest;
            const response = await UserService.registerConsumer(request);
            res.status(201).json({
                message: "Konsumen berhasil sign up"
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

    static async getProfile(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const requestId = String(req.user.id);

            const response = await UserService.getProfileUser(req.user);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }
}