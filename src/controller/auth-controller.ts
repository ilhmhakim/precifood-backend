// src/controller/auth-controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth-service";
import { UserRequest } from "../type/user";
import {RefreshTokenRequest} from "../model/auth-model";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AuthService.login(req.body);
            res.status(200).json({
                message: "Login berhasil!",
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RefreshTokenRequest = req.body;
            const accessToken = await AuthService.refreshToken(request);
            res.status(201).json({

                data: accessToken
            });
        } catch (e) {
            next(e);
        }
    }

    static async logOut(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            await AuthService.logOut(userId);
            res.status(200).json({
                message: "Logout berhasil!"
            });
        } catch (e) {
            next(e);
        }
    }
}
