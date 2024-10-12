import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {jwtRefresh, jwtSecret} from "../config/jwt";
import {UserResponse} from "../model/user-model";
import {UserPayload} from "../type/user";

const _SecretToken = "VeryTopSecretKey.UseRandomStringOfLongLength";
const _TokenExpiryTime = "24h";

export const authorizeMiddleware = function (roles: string[] = []) {
    if (!Array.isArray(roles)) roles = [roles];

    return (req: Request, res: Response, next: NextFunction) => {
        function sendError(msg: string, statusCode: number = 403) {
            return res.status(statusCode).json({
                errors: msg,
            });
        }

        try {
            const token = req.headers["authorization"] as string;

            if (!token) return sendError("Token tidak tersedia", 401); // Token does not exist
            if (!token.startsWith("Bearer ")) return sendError("Error: Token format invalid"); // Wrong format

            const tokenString = token.split(" ")[1];
            jwt.verify(tokenString, jwtSecret.secret, (err, decodedToken) => {
                if (err || !decodedToken) {
                    console.error(err);
                    return sendError("Broken Or Expired Token", 401);
                }

                const decoded: UserPayload = decodedToken as UserPayload;

                if (!decoded.role) return sendError("Error: Role missing");
                const userRole = decoded.role;
                if (roles.indexOf(userRole) === -1)
                    return sendError("User not authorized");

                req.user = decoded;
                next();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error Occured" });
        }
    };
};

export const issueToken = function (user: UserPayload) {
    const token = jwt.sign({ ...user, iss: "Node-Auth" }, _SecretToken, {
        expiresIn: _TokenExpiryTime,
    });
    return token;
};

export const Roles = {
    Consumer: ["Konsumen"],
    Restaurant: ["Restoran"],
    Admin: ["Admin"],
    All: ["Konsumen", "Restoran", "Admin"],
};
