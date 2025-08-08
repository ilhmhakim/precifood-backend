// src/service/auth-service.ts
import { prismaClient } from '../application/database';
import { LoginUserRequest } from '../model/user-model';
import { Validation } from '../validation/validation';
import { ResponseError } from '../error/response-error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtRefresh, jwtSecret } from '../config/jwt';
import {
    issueAccessToken,
    issueRefreshToken,
} from '../middleware/auth-middleware';
import { UserPayload } from '../type/user';
import { AuthValidation } from '../validation/auth-validation';
import {
    RefreshTokenRequest,
    toUserLoginResponse,
    toUserRefreshToken,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UserLoginResponse,
    UserRefreshAccessTokenResponse,
} from '../model/auth-model';

export class AuthService {
    static async login(request: LoginUserRequest): Promise<UserLoginResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: { email: loginRequest.email },
        });

        if (!user?.email) {
            throw new ResponseError(404, 'Registrasi terlebih dahulu');
        }

        if (
            !user ||
            !(await bcrypt.compare(loginRequest.password, user.password))
        ) {
            throw new ResponseError(401, 'Email atau password salah');
        }

        const userPayload: UserPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = issueAccessToken(userPayload);
        const refreshToken = issueRefreshToken(userPayload);

        const userToken = await prismaClient.user.update({
            where: { id: user.id },
            data: { token: refreshToken },
        });

        return toUserLoginResponse(accessToken, userToken, user.role);
    }

    static async refreshToken(
        request: RefreshTokenRequest
    ): Promise<UserRefreshAccessTokenResponse> {
        const requestRefreshToken = Validation.validate(
            AuthValidation.REFRESH,
            request
        );
        if (!requestRefreshToken) {
            throw new ResponseError(401, 'Refresh token tidak tersedia');
        }

        const decoded = jwt.verify(
            requestRefreshToken.refresh_token,
            jwtRefresh.secret!
        ) as { id: string };
        const user = await prismaClient.user.findFirst({
            where: { id: decoded.id },
        });

        if (!user || user.token !== requestRefreshToken.refresh_token) {
            throw new ResponseError(403, 'Refresh token tidak valid');
        }

        const userPayload: UserPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = issueAccessToken(userPayload);

        return toUserRefreshToken(accessToken);
    }

    static async updateEmail(request: UpdateEmailRequest) {
        const requestUpdateEmail = Validation.validate(
            AuthValidation.UPDATEEMAIL,
            request
        );

        const user = await prismaClient.user.findFirst({
            where: {
                id: requestUpdateEmail.user_id,
            },
        });

        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: requestUpdateEmail.new_email,
            },
        });

        if (totalUserWithSameEmail !== 0) {
            throw new ResponseError(
                409,
                'Email baru telah digunakan oleh pengguna lain'
            );
        }

        if (
            !(await bcrypt.compare(requestUpdateEmail.password, user!.password))
        ) {
            throw new ResponseError(400, 'Password invalid');
        }

        await prismaClient.user.update({
            where: {
                id: requestUpdateEmail.user_id,
            },
            data: {
                email: requestUpdateEmail.new_email,
            },
        });
    }

    static async updatePassword(request: UpdatePasswordRequest) {
        const requestUpdatePassword = Validation.validate(
            AuthValidation.UPDATEPASSWORD,
            request
        );

        const user = await prismaClient.user.findFirst({
            where: {
                id: requestUpdatePassword.user_id,
            },
        });

        if (
            !(await bcrypt.compare(
                requestUpdatePassword.old_password,
                user!.password
            ))
        ) {
            throw new ResponseError(400, 'Password lama tidak sesuai');
        }

        if (
            requestUpdatePassword.new_password !=
            requestUpdatePassword.password_confirmation
        ) {
            throw new ResponseError(
                400,
                'Password baru dan konfirmasi password tidak sama'
            );
        }

        requestUpdatePassword.new_password = await bcrypt.hash(
            requestUpdatePassword.new_password,
            10
        );

        await prismaClient.user.update({
            where: {
                id: requestUpdatePassword.user_id,
            },
            data: {
                password: requestUpdatePassword.new_password,
            },
        });
    }

    static async logout(userId: string) {
        await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: {
                token: null,
            },
        });
    }
}
