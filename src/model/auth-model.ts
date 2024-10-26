import {User} from "@prisma/client";

export type UserLoginResponse = {
    access_token: string;
    refresh_token: string | null;
}

export type UserRefreshAccessTokenResponse = {
    access_token: string;
}

export type RefreshTokenRequest = {
    refresh_token: string;
}

export function toUserLoginResponse(accessToken: string, user: User): UserLoginResponse {
    return {
        access_token: accessToken,
        refresh_token: user.token
    }
}

export function toUserRefreshToken(accessToken: string): UserRefreshAccessTokenResponse {
    return {
        access_token: accessToken,
    }
}