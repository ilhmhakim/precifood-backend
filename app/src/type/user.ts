// User Payload
import {JwtPayload} from "jsonwebtoken";
import {Request} from "express";

export interface UserRequest extends Request {
    user: {
        id: string;
        role: string;
    }
}

export interface UserPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;
    iss?: string;
}

// // Enum Type
// export enum RoleName {
//     Konsumen,
//     Restoran,
//     Admin,
// }
//
// export enum ConsumerSex {
//     "Laki_Laki",
//     Perempuan,
// }
//
// export enum MenuCategory {
//     "Makanan Pokok",
//     "Lauk Pauk",
//     Sayuran,
//     Minuman,
// }
//
// export enum MenuStatus {
//     Approved,
//     Waiting,
//     Rejected,
// }
