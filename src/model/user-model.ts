import {User, Consumer, Restaurant, PersonalInformation, MedicalHistory, Contact, Address} from "@prisma/client";
import {add} from "winston";


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
    city: string;
    address: string;
    image: string;
    password: string;
    password_confirmation: string;
}

// Login Request
export type LoginUserRequest = {
    email: string;
    password: string;
}

// Get
export type GetConsumerRequest = {
    consumer_id: string;
}

export type UserProfileRequest = {
    id: string;
}

export type ConsumerProfileResponse = {
    user: {
        id: string;
        email: string;
        registered_at: Date;
    };
    personal_information: {
        name: string;
        sex: string;
        birth: Date;
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

export type RestaurantProfileResponse = {
    user: {
        id: string;
        email: string;
        registered_at: string;
    };
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    address: {
        province: string;
        city: string;
        address_detail: string;
        image: string;
    }
}


export type ConsumerInfoResponse = {
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

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
    }
}

export function toConsumerProfileResponse(user: User, personalInformation: PersonalInformation, medicalHistory: MedicalHistory): ConsumerProfileResponse {
    return {
        user: {
            id: user.id,
            email: user.email,
            registered_at: user.registered_at
        },
        personal_information: {
            name: personalInformation.name,
            sex: personalInformation.sex,
            birth: personalInformation.birth,
            phone: personalInformation.phone,
            height: personalInformation.height,
            weight: personalInformation.weight,
            age: personalInformation.age
        },
        medical_history: {
            no_history: medicalHistory.no_history,
            diabetes: medicalHistory.diabetes,
            hypertension: medicalHistory.hypertension,
            cardiovascular: medicalHistory.cardiovascular
        }
    }
}

export function toRestaurantProfile(user: User, contact: Contact, address: Address): RestaurantProfileResponse {
    return {
        user: {
            id: user.id,
            email: user.email,
            registered_at: user.registered_at.toLocaleDateString()
        },
        contact: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone
        },
        address: {
            province: address.province,
            city: address.city,
            address_detail: address.address_detail
        }
    }
}


