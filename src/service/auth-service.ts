// src/service/auth-service.ts
import { prismaClient } from "../application/database";
import { LoginUserRequest } from "../model/user-model";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {jwtRefresh, jwtSecret} from "../config/jwt";
import {issueAccessToken, issueRefreshToken} from "../middleware/auth-middleware";
import { UserPayload } from "../type/user";
import { AuthValidation } from "../validation/auth-validation";
import {
    RefreshTokenRequest,
    toUserLoginResponse,
    toUserRefreshToken, UserLoginResponse,
    UserRefreshAccessTokenResponse
} from "../model/auth-model";
import {request} from "express";

export class AuthService {
    static async login(request: LoginUserRequest): Promise<UserLoginResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: { email: loginRequest.email }
        });

        if (!user || !(await bcrypt.compare(loginRequest.password, user.password))) {
            throw new ResponseError(401, "Email atau password salah");
        }

        const userPayload: UserPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = issueAccessToken(userPayload);
        const refreshToken = issueRefreshToken(userPayload);

        const userToken = await prismaClient.user.update({
            where: { id: user.id },
            data: { token: refreshToken }
        });

        return toUserLoginResponse(accessToken, userToken);
    }

    static async refreshToken(request: RefreshTokenRequest): Promise<UserRefreshAccessTokenResponse> {
        const requestRefreshToken = Validation.validate(AuthValidation.REFRESH, request);
        if (!requestRefreshToken) {
            throw new ResponseError(401, "Refresh token tidak tersedia");
        }

        const decoded = jwt.verify(requestRefreshToken.refresh_token, jwtRefresh.secret!) as { id: string };
        const user = await prismaClient.user.findFirst({ where: { id: decoded.id } });

        if (!user || user.token !== requestRefreshToken.refresh_token) {
            throw new ResponseError(403, "Refresh token tidak valid");
        }

        const userPayload: UserPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = issueAccessToken(userPayload);

        return toUserRefreshToken(accessToken);
    }

    static async logOut(userId: string) {
        await prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                token: null
            }
        });
    }
}
