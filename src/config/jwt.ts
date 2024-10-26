import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = {
    secret: process.env.JWT_SECRET,
    options: {
        expiresIn: process.env.JWT_SECRET_EXPIRE
    }
};

export const jwtRefresh = {
    secret: process.env.JWT_SECRET_REFRESH,
    options: {
        expiresIn: process.env.JWT_SECRET_REFRESH_EXPIRE
    }
};