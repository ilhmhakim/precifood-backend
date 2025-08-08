// src/controller/auth-controller.ts
import {
    RefreshTokenRequest,
    UpdateEmailRequest,
    UpdatePasswordRequest,
} from '../model/auth-model';
import { AuthService } from '../service/auth-service';
import { UserService } from '../service/user-service';
import { UserRequest } from '../type/user';
import { Request, Response, NextFunction } from 'express';

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AuthService.login(req.body);
            res.status(200).json({
                message: 'Success!',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RefreshTokenRequest =
                req.body as RefreshTokenRequest;
            const accessToken = await AuthService.refreshToken(request);
            res.status(201).json({
                message: 'Success!',
                data: accessToken,
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateEmail(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const request: UpdateEmailRequest = {
                user_id: req.user.id,
                new_email: req.body.new_email,
                password: req.body.password,
            };
            await AuthService.updateEmail(request);
            res.status(201).json({
                message: 'Success!',
            });
        } catch (e) {
            next(e);
        }
    }

    static async updatePassword(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const request: UpdatePasswordRequest = {
                user_id: req.user.id,
                old_password: req.body.old_password,
                new_password: req.body.new_password,
                password_confirmation: req.body.password_confirmation,
            };

            await AuthService.updatePassword(request);
            res.status(201).json({
                message: 'Success!',
            });
        } catch (e) {}
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            await AuthService.logout(userId);
            res.status(200).json({
                message: 'Success!',
            });
        } catch (e) {
            next(e);
        }
    }
}
