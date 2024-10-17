import {
    ConsumerProfileResponse,
    CreateAdminRequest,
    CreateConsumerRequest,
    CreateRestaurantRequest,
    GetUserProfileRequest,
    RestaurantProfileResponse,
    toConsumerProfileResponse,
    toRestaurantProfile,
    toUserResponse,
    UserResponse
} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {v7 as uuid7} from "uuid";
import {Consumer, User} from "@prisma/client";


export class UserService {

    static async registerConsumer(request: CreateConsumerRequest): Promise<UserResponse> {
        const registerConsumerRequest = Validation.validate(UserValidation.REGISTERCONSUMER, request);

        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: registerConsumerRequest.email
            }
        });

        if (totalUserWithSameEmail != 0) {
            throw new ResponseError(400, "Email is already taken");
        }

        if (registerConsumerRequest.password != registerConsumerRequest.password_confirmation) {
            throw new ResponseError(400, "Password and Password Confirmation are not the same");
        }

        registerConsumerRequest.password = await bcrypt.hash(registerConsumerRequest.password, 10);

        const calculateAge = (birthDate: Date): number => {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();

            // Check if the birthdate has occurred this year
            const isBirthdayPassed =
                today.getMonth() > birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

            if (!isBirthdayPassed) {
                age--; // Birthday has not occurred yet this year, adjust the age
            }

            return age;
        };

        const birth = new Date(registerConsumerRequest.birth);
        const age = Number(calculateAge(birth));

        const consumer_id = String(`C-${uuid7()}`);

        const user = await prismaClient.user.create({
            data: {
                id: consumer_id, // ID yang sama digunakan untuk User dan Consumer
                email: registerConsumerRequest.email,
                password: registerConsumerRequest.password,
                role: "Konsumen", // Sesuai dengan role yang sudah ditentukan
                consumer: {
                    create: {
                        // Buat data untuk PersonalInformation
                        PersonalInformation: {
                            create: {
                                name: registerConsumerRequest.name,
                                sex: registerConsumerRequest.sex,
                                weight: registerConsumerRequest.weight,
                                height: registerConsumerRequest.height,
                                age: age,
                                birth: birth,
                                phone: registerConsumerRequest.phone,
                            }
                        },

                        // Buat data untuk MedicalHistory
                        MedicalHistory: {
                            create: {
                                no_history: registerConsumerRequest.no_history,
                                diabetes: registerConsumerRequest.diabetes,
                                hypertension: registerConsumerRequest.hypertension,
                                cardiovascular: registerConsumerRequest.cardiovascular,
                            }
                        }
                    }
                }
            }
        });

        return toUserResponse(user);
    }

    static async registerRestaurant(request: CreateRestaurantRequest) : Promise<UserResponse> {
        const registerRestaurantRequest = Validation.validate(UserValidation.REGISTERRESTAURANT, request);

        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: registerRestaurantRequest.email
            }
        });

        if (totalUserWithSameEmail != 0) {
            throw new ResponseError(400, "Email is already taken");
        }

        if (registerRestaurantRequest.password != registerRestaurantRequest.password_confirmation) {
            throw new ResponseError(400, "Password and Password Confirmation are not the same");
        }

        registerRestaurantRequest.password = await bcrypt.hash(registerRestaurantRequest.password, 10);

        const restaurant_id = String(`R-${uuid7()}`);

        const user = await prismaClient.user.create({
            data: {
                id: restaurant_id, // ID yang sama digunakan untuk User dan Restaurant
                email: registerRestaurantRequest.email,
                password: registerRestaurantRequest.password,
                role: "Restoran", // Sesuai dengan role yang sudah ditentukan
                restaurant: {
                    create: {
                        // Buat data untuk Contact
                        Contact: {
                            create: {
                                name: registerRestaurantRequest.name,
                                email: registerRestaurantRequest.email,
                                phone: registerRestaurantRequest.phone,
                            }
                        },

                        // Buat data untuk Address
                        Address: {
                            create: {
                                province: registerRestaurantRequest.province,
                                city: registerRestaurantRequest.city,
                                image_url: registerRestaurantRequest.image,
                            }
                        }
                    }
                }
            }
        });

        return toUserResponse(user);
    }

    // Registrasi admin
    static async registerAdmin(request: CreateAdminRequest) : Promise<UserResponse> {
        const registerAdminRequest = Validation.validate(UserValidation.REGISTERADMIN, request);

        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: registerAdminRequest.email
            }
        });

        if (totalUserWithSameEmail != 0) {
            throw new ResponseError(400, "Email is already taken");
        }

        if (registerAdminRequest.password != registerAdminRequest.password_confirmation) {
            throw new ResponseError(400, "Password and Password Confirmation are not the same");
        }

        registerAdminRequest.password = await bcrypt.hash(registerAdminRequest.password, 10);

        const admin_id = String(`A-${uuid7()}`);

        const user = await prismaClient.user.create({
           data: {
               id: admin_id, // ID yang sama digunakan untuk User dan Restaurant
               email: registerAdminRequest.email,
               password: registerAdminRequest.password,
               role: "Admin"
           }
        });

        return toUserResponse(user);
    }

    // Mendapatkan detail spesifik user
    static async getProfileConsumer(request: GetUserProfileRequest): Promise<ConsumerProfileResponse> {
        const requestId = Validation.validate(UserValidation.GETUSERPROFILE, request);
        const user = await prismaClient.user.findFirst({
            where: {
                id: requestId.id,
            },
            include: {
                consumer: {
                    include: {
                        PersonalInformation: true,
                        MedicalHistory: true,
                    },
                },
            },
        });

        if (!user || !user.consumer) {
            throw new ResponseError(404, "Konsumen tidak ditemukan");
        }

        const { PersonalInformation, MedicalHistory } = user.consumer;

        return toConsumerProfileResponse(user, PersonalInformation!, MedicalHistory!);
    }

    static async getProfileRestaurant(request: GetUserProfileRequest): Promise<RestaurantProfileResponse> {
        const requestId = Validation.validate(UserValidation.GETUSERPROFILE, request);
        const user = await prismaClient.user.findFirst({
            where: {
                id: requestId.id,
            },
            include: {
                restaurant: {
                    include: {
                        Contact: true,
                        Address: true,
                    }
                }
            }
        });

        if (!user || !user.restaurant) {
            throw new ResponseError(404, "Restoran tidak ditemukan");
        }

        const { Contact, Address } = user.restaurant;

        return toRestaurantProfile(user, Contact!, Address!);
    }

    static async getInfoConsumer(request: GetUserProfileRequest): Promise<ConsumerProfileResponse> {

    }

}