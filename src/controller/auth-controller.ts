import {Request, Response,NextFunction} from "express";
import {LoginUserRequest} from "../model/user-model";
import {AuthService} from "../service/auth-service";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await AuthService.login(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}