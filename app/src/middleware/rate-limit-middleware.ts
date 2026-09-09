import { Options, rateLimit } from 'express-rate-limit';

const baseOptions = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
} satisfies Partial<Options>;

const RATE_LIMIT_ERROR_MESSAGE = 'Too Many Requests, please try again later.';

export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 2 * 60 * 1000,
  limit: 5,
  message: { errors: RATE_LIMIT_ERROR_MESSAGE },
});

export const writeLimiter = rateLimit({
  ...baseOptions,
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: { errors: RATE_LIMIT_ERROR_MESSAGE },
});
