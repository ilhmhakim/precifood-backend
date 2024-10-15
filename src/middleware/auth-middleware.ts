import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { jwtSecret } from "../config/jwt";
import { UserPayload, UserRequest } from "../type/user";

export const authorizeMiddleware = function (roles: string[] = []) {
    if (!Array.isArray(roles)) roles = [roles];

    return (req: UserRequest, res: Response, next: NextFunction) => {
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
            jwt.verify(tokenString, jwtSecret.secret!, (err, decodedToken) => {
                if (err || !decodedToken) {
                    console.error(err);
                    return sendError("Broken Or Expired Token", 401);
                }

                const decoded: UserPayload = decodedToken as UserPayload;

                if (!decoded.role) return sendError("Error: Role missing");

                const userRole = decoded.role;

                if (roles.indexOf(userRole) === -1) return sendError("User not authorized");

                // Tambahkan user ke request
                req.user = {
                    id: decoded.id,
                    role: decoded.role
                };
                next();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error Occured" });
        }
    };
};


export const issueToken = function (user: UserPayload) {
    const token = jwt.sign({ ...user, iss: "Node-Auth" }, jwtSecret.secret!, jwtSecret.options);
    return token;
};

export const Roles = {
    Consumer: ["Konsumen"],
    Restaurant: ["Restoran"],
    Admin: ["Admin"],
    All: ["Konsumen", "Restoran", "Admin"],
};
