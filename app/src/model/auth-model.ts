import { User } from '@prisma/client';

export type UserLoginResponse = {
  role: string;
  access_token: string;
  refresh_token: string | null;
  // restaurant_id asli akun login (role Restoran) - mencegah FE memakai dropdown id yang keliru
  restaurant_id?: string | null;
};

export type UserRefreshAccessTokenResponse = {
  access_token: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type UpdateEmailRequest = {
  user_id: string;
  new_email: string;
  password: string;
};

export type UpdatePasswordRequest = {
  user_id: string;
  old_password: string;
  new_password: string;
  password_confirmation: string;
};

export function toUserLoginResponse(
  accessToken: string,
  user: User,
  userRole: string,
  restaurantId?: string | null
): UserLoginResponse {
  return {
    role: userRole,
    access_token: accessToken,
    refresh_token: user.token,
    restaurant_id: userRole === 'Restoran' ? restaurantId : null,
  };
}

export function toUserRefreshToken(
  accessToken: string
): UserRefreshAccessTokenResponse {
  return {
    access_token: accessToken,
  };
}
