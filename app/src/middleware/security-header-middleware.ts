import { NextFunction, Request, Response } from 'express';

// PF-SEC-18: OWASP-recommended headers for the API responses.
export const securityHeaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=15552000; includeSubDomains'
  );
  next();
};
