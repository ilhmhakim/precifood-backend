// src/middleware/auth-middleware.ts
import { jwtRefresh, jwtSecret } from '../config/jwt';
import { UserPayload, UserRequest } from '../type/user';
import { Response, NextFunction } from 'express';
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
      jwt.verify(tokenString, jwtSecret.secret!, (err, decodedToken) => {
        if (err || !decodedToken)
          return sendError('Token invalid atau kadaluarsa', 401);

        const decoded: UserPayload = decodedToken as UserPayload;
        if (!roles.includes(decoded.role))
          return sendError('User tidak memiliki akses');

        req.user = { id: decoded.id, role: decoded.role };
        next();
      });
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
};
