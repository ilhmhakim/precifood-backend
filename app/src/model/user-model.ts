import {
    User,
    PersonalInformation,
    MedicalHistory,
    Contact,
    Address,
} from '@prisma/client';

// Create (Register)
export type CreateConsumerRequest = {
    name: string;
    email: string;
    sex: string;
    birth: string;
    phone: string;
    height: number;
    weight: number;
    medical_history: string;
    no_history?: boolean;
    diabetes?: boolean;
    hypertension?: boolean;
    cardiovascular?: boolean;
    password: string;
    password_confirmation: string;
};

export type CreateRestaurantRequest = {
    name: string;
    email: string;
    phone: string;
    province: string;
    city: string;
    address_detail: string;
    image_url: string;
    password: string;
    password_confirmation: string;
};

export type CreateAdminRequest = {
    email: string;
    password: string;
    password_confirmation: string;
};

// Login Request
export type LoginUserRequest = {
    email: string;
    password: string;
};

// Get
export type GetUserProfileRequest = {
    id: string;
};

export type ConsumerProfileResponse = {
    user?: {
        id: string;
        email: string;
        registered_at: Date;
    };
    personal_information?: {
        name: string;
        sex: string;
        birth: string;
        phone: string;
        height: number;
        weight: number;
        age: number;
    };
    medical_history: string;
};

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
        image_url: string;
    };
};

export type ConsumerInfoResponse = {
    personal_information: {
        height: number;
        weight: number;
    };
    medical_history: string;
};

// Update
export type UpdateConsumerRequest = {
    id: string;
    name?: string;
    sex?: string;
    birth?: Date;
    phone?: string;
    height?: number;
    weight?: number;
    medical_history?: string;
    no_history?: boolean;
    diabetes?: boolean;
    hypertension?: boolean;
    cardiovascular?: boolean;
};

export type UpdateRestaurantRequest = {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    province?: string;
    city?: string;
    address_detail?: string;
    image_url?: string;
};

export type AllUsersResponse = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

export function toConsumerInfo(
    personalInformation: PersonalInformation,
    medicalHistory: MedicalHistory
): ConsumerInfoResponse {
    // Menentukan status riwayat medis yang sesuai
    let medicalHistoryStatus: string = 'no_history'; // Default ke "no_history" jika semuanya `false`

    if (medicalHistory.diabetes) {
        medicalHistoryStatus = 'diabetes';
    } else if (medicalHistory.cardiovascular) {
        medicalHistoryStatus = 'cardiovascular';
    } else if (medicalHistory.hypertension) {
        medicalHistoryStatus = 'hypertension';
    }

    return {
        personal_information: {
            height: personalInformation.height,
            weight: personalInformation.weight,
        },
        medical_history: medicalHistoryStatus,
    };
}

export function toConsumerProfileResponse(
    user: User,
    personalInformation: PersonalInformation,
    medicalHistory: MedicalHistory
): ConsumerProfileResponse {
    // Menentukan status riwayat medis yang sesuai
    let medicalHistoryStatus: string = 'no_history'; // Default ke "no_history" jika semuanya `false`

    if (medicalHistory.diabetes) {
        medicalHistoryStatus = 'diabetes';
    } else if (medicalHistory.cardiovascular) {
        medicalHistoryStatus = 'cardiovascular';
    } else if (medicalHistory.hypertension) {
        medicalHistoryStatus = 'hypertension';
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            registered_at: user.registered_at,
        },
        personal_information: {
            name: personalInformation.name,
            sex: personalInformation.sex,
            birth: personalInformation.birth.toLocaleDateString(),
            phone: personalInformation.phone,
            height: personalInformation.height,
            weight: personalInformation.weight,
            age: personalInformation.age,
        },
        medical_history: medicalHistoryStatus,
    };
}

export function toRestaurantProfile(
    user: User,
    contact: Contact,
    address: Address
): RestaurantProfileResponse {
    return {
        user: {
            id: user.id,
            email: user.email,
            registered_at: user.registered_at.toLocaleDateString(),
        },
        contact: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        },
        address: {
            province: address.province,
            city: address.city,
            address_detail: address.address_detail,
            image_url: address.image_url,
        },
    };
}

export function toAllConsumers(
    user: User,
    personalInformation: PersonalInformation
): AllUsersResponse {
    return {
        id: user.id,
        name: personalInformation.name,
        email: user.email,
        phone: personalInformation.phone,
    };
}

export function toAllRestaurant(
    user: User,
    contact: Contact
): AllUsersResponse {
    return {
        id: user.id,
        name: contact.name,
        email: user.email,
        phone: contact.phone,
    };
}

export function toAllRestaurantsPublic(contact: Contact): any {
    return {
        id: contact.restaurant_id,
        name: contact.name,
    };
}
