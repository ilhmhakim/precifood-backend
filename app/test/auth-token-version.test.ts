import { prismaClient } from '../src/application/database';
import { jwtSecret } from '../src/config/jwt';
import {
  authorizeMiddleware,
  issueAccessToken,
  issueRefreshToken,
} from '../src/middleware/auth-middleware';
import { AuthService } from '../src/service/auth-service';
import { UserPayload } from '../src/type/user';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('../src/application/database', () => ({
  prismaClient: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashed'),
}));

const userMock = prismaClient.user as unknown as {
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  update: jest.Mock;
};

const baseUser = {
  id: 'C-0123456789-0123-4567-89ab-cdef01234567',
  email: 'tokenversion@test.local',
  role: 'Konsumen',
};

function payloadAt(tv: number): UserPayload {
  return { ...baseUser, tv };
}

function runMiddleware(accessToken: string, roles: string[] = ['Konsumen']) {
  const req = {
    headers: { authorization: `Bearer ${accessToken}` },
  } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;

  return authorizeMiddleware(roles)(req, res, next).then(() => ({
    req: req as unknown as { user: { id: string; role: string } },
    res,
    next,
  }));
}

function decodeAccessToken(token: string): UserPayload {
  return jwt.verify(token, jwtSecret.secret!) as UserPayload;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Access token revocation via token version', () => {
  it('rejects an access token whose tv was superseded by a refresh rotation', async () => {
    const staleToken = issueAccessToken(payloadAt(1));
    userMock.findUnique.mockResolvedValue({
      token: 'current-refresh-token',
      tokenVersion: 2,
    });

    const { res, next } = await runMiddleware(staleToken);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts the freshly issued access token after rotation', async () => {
    const freshToken = issueAccessToken(payloadAt(2));
    userMock.findUnique.mockResolvedValue({
      token: 'current-refresh-token',
      tokenVersion: 2,
    });

    const { req, res, next } = await runMiddleware(freshToken);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(401);
    expect(req.user).toEqual({ id: baseUser.id, role: 'Konsumen' });
  });

  it('rejects access tokens whose session refresh token was cleared (logout)', async () => {
    const token = issueAccessToken(payloadAt(3));
    userMock.findUnique.mockResolvedValue({ token: null, tokenVersion: 3 });

    const { res, next } = await runMiddleware(token);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects access tokens without a tv claim (pre-upgrade tokens)', async () => {
    const legacyToken = jwt.sign(
      { id: baseUser.id, email: baseUser.email, role: baseUser.role },
      jwtSecret.secret!,
      jwtSecret.options
    );
    userMock.findUnique.mockResolvedValue({
      token: 'current-refresh-token',
      tokenVersion: 0,
    });

    const { res, next } = await runMiddleware(legacyToken);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('AuthService rotates token version', () => {
  it('bumps tokenVersion on refresh and issues an access token with the new tv', async () => {
    const currentRefresh = issueRefreshToken(payloadAt(5));
    userMock.findFirst.mockResolvedValue({
      ...baseUser,
      password: 'hashed',
      token: currentRefresh,
      tokenVersion: 5,
    });
    userMock.update.mockResolvedValue({});

    const result = await AuthService.refreshToken({
      refresh_token: currentRefresh,
    });

    expect(userMock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: baseUser.id },
        data: expect.objectContaining({ tokenVersion: 6 }),
      })
    );
    expect(decodeAccessToken(result.access_token).tv).toBe(6);
  });

  it('rejects an old access token immediately after the refresh rotation', async () => {
    const oldAccess = issueAccessToken(payloadAt(5));
    const currentRefresh = issueRefreshToken(payloadAt(5));
    userMock.findFirst.mockResolvedValue({
      ...baseUser,
      password: 'hashed',
      token: currentRefresh,
      tokenVersion: 5,
    });
    userMock.update.mockResolvedValue({});

    const refreshed = await AuthService.refreshToken({
      refresh_token: currentRefresh,
    });

    userMock.findUnique.mockResolvedValue({
      token: refreshed.refresh_token,
      tokenVersion: 6,
    });

    const old = await runMiddleware(oldAccess);
    expect(old.res.status).toHaveBeenCalledWith(401);
    expect(old.next).not.toHaveBeenCalled();

    const now = await runMiddleware(refreshed.access_token);
    expect(now.next).toHaveBeenCalledTimes(1);
  });

  it('bumps tokenVersion on logout and clears the stored refresh token', async () => {
    userMock.update.mockResolvedValue({});

    await AuthService.logout(baseUser.id);

    expect(userMock.update).toHaveBeenCalledWith({
      where: { id: baseUser.id },
      data: { token: null, tokenVersion: { increment: 1 } },
    });
  });

  it('bumps tokenVersion on login and issues tokens carrying it', async () => {
    userMock.findUnique.mockResolvedValue({
      ...baseUser,
      password: 'hashed',
      tokenVersion: 0,
    });
    userMock.update.mockResolvedValue({
      ...baseUser,
      password: 'hashed',
      tokenVersion: 1,
      token: 'newly-stored-refresh',
    });

    const result = await AuthService.login({
      email: baseUser.email,
      password: 'password123',
    });

    expect(userMock.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ tokenVersion: 1 }) })
    );
    expect(decodeAccessToken(result.access_token).tv).toBe(1);
  });
});
