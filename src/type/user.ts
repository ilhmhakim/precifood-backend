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

// Enum Type
export enum RoleName {
    Konsumen,
    Restoran,
    Admin,
}

export enum ConsumerSex {
    "Laki_Laki",
    Perempuan,
}

export enum MenuCategory {
    "Makanan Pokok",
    "Lauk Pauk",
    Sayuran,
    Minuman,
}

export enum MenuStatus {
    Approved,
    Waiting,
    Rejected,
}

// Consumer memiliki atribut PersonalInformation dan MedicalHistory
export type Consumer = {
    id: string;
    personal_information: PersonalInformation;
    medical_history: MedicalHistory;
}

export type PersonalInformation = {
    id: string;
    name: string;
    sex: string;
    weight: number;
    height: number;
    age: number;
    birth: Date;
    phone: string;
}

export type MedicalHistory = {
    id: string;
    no_history: boolean;
    diabetes: boolean;
    hypertension: boolean;
    cardiovascular: boolean;
    update_at: Date;
}

// Restoran memiliki atribut Contact dan Address
export type Restaurant = {
    id: string;
    contact: Contact;
    address: Address;
}

export type Contact = {
    id: string;
    email: string;
    phone: string;
}

export type Address = {
    id: string;
    province: string;
    city: string;
    address: string;
    image_url: string;
}

// Admin hanya memiliki id
export type Admin = {
    id: string;
}