// src/middleware/auth-middleware.ts
import { prismaClient } from '../application/database';
import { jwtRefresh, jwtSecret } from '../config/jwt';
import { UserPayload, UserRequest } from '../type/user';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const issueAccessToken = (user: UserPayload): string => {
  return jwt.sign(user, jwtSecret.secret!, jwtSecret.options);
};

export const issueRefreshToken = (user: UserPayload): string => {
  return jwt.sign(user, jwtRefresh.secret!, jwtRefresh.options);
};

export const authorizeMiddleware = function (roles: string[] = []) {
  if (!Array.isArray(roles)) roles = [roles];

  return async (req: UserRequest, res: Response, next: NextFunction) => {
    function sendError(msg: string, statusCode: number = 403) {
      return res.status(statusCode).json({ errors: msg });
    }

    try {
      const token = req.headers['authorization'] as string;

      if (!token) return sendError('Token tidak tersedia', 401);
      if (!token.startsWith('Bearer '))
        return sendError('Token format invalid');

      const tokenString = token.split(' ')[1];
      let decoded: UserPayload;
      try {
        decoded = jwt.verify(tokenString, jwtSecret.secret!) as UserPayload;
      } catch {
        return sendError('Token invalid atau kadaluarsa', 401);
      }

      if (!decoded || !roles.includes(decoded.role))
        return sendError('User tidak memiliki akses');

      const session = await prismaClient.user.findUnique({
        where: { id: decoded.id },
        select: { token: true, tokenVersion: true },
      });
      if (!session || !session.token || decoded.tv !== session.tokenVersion)
        return sendError('Sesi telah berakhir, silakan login kembali', 401);

      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
};
