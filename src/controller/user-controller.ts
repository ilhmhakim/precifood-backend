import {Request, Response, NextFunction} from "express";
import {CreateConsumerRequest} from "../model/user-model";
import {UserService} from "../service/user-service";

export class UserController {
    static async registerConsumer(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateConsumerRequest = req.body as CreateConsumerRequest;
            const response = await UserService.registerConsumer(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }
}