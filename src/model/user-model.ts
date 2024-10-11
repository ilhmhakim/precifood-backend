import {User} from "@prisma/client";
import {Admin, Consumer, MedicalHistory, PersonalInformation, Restaurant, RoleName} from "../type/user";

// Model User
export type UserResponse = {
    id: string;
    email: string;
    role: string;
    token?: string | null;
}

// Create (Register)
export type CreateConsumerRequest = {
    name: string;
    email: string;
    sex: string;
    birth: string;
    phone: string;
    height: number;
    weight: number;
    no_history: boolean;
    diabetes: boolean;
    hypertension: boolean;
    cardiovascular: boolean;
    password: string;
    password_confirmation: string;
}

export type CreateRestaurantRequest = {
    name: string;
    email: string;
    phone: string;
    province: string;
    address: string;
    image: File;
}

// Login Request
export type LoginRequest = {
    email: string;
    password: string;
}

// Update
export type UpdateConsumerProfileRequest = {
    name: string;
    sex: string;
    birth: string;
    phone: string;
    height: number;
    weight: number;
    no_history: boolean;
    diabetes: boolean;
    hypertension: boolean;
    cardiovascular: boolean;
}

export type UpdateRestaurantProfileRequest = {
    name: string;
    email: string;
    phone: string;
    province: string;
    address: string;
    image: File;
}

// Get
export type GetConsumerRequest = {
    consumer_id: string;
}

export type ConsumerProfile = {
    personal_information: {
        name: string;
        sex: string;
        birth: string;
        phone: string;
        height: number;
        weight: number;
        age: number;
    };
    medical_history: {
        no_history: boolean;
        diabetes: boolean;
        hypertension: boolean;
        cardiovascular: boolean;
    };
}

export type RestaurantProfile = {
    contact: {

    };
}


export type ConsumerInfo = {
    personal_information: {
        height: number;
        weight: number;
    };
    medical_history: {
        no_history: boolean;
        diabetes: boolean;
        hypertension: boolean;
        cardiovascular: boolean;
    };
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
    }
}


