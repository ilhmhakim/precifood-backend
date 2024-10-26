import {
    AllUsersResponse,
    ConsumerInfoResponse,
    ConsumerProfileResponse,
    CreateAdminRequest,
    CreateConsumerRequest,
    CreateRestaurantRequest,
    GetUserProfileRequest,
    RestaurantProfileResponse,
    toAllConsumers,
    toAllRestaurant,
    toConsumerInfo,
    toConsumerProfileResponse,
    toRestaurantProfile,
    UpdateConsumerRequest,
    UpdateRestaurantRequest,

} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {v7 as uuid7} from "uuid";


export class UserService {

    static async calculateAge(birthDate: Date): Promise<number> {
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
    }

    static async registerConsumer(request: CreateConsumerRequest) {
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

        const birth = new Date(registerConsumerRequest.birth);
        const age = Number(await this.calculateAge(birth));

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
    }

    static async registerRestaurant(request: CreateRestaurantRequest) {
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
                                address_detail: registerRestaurantRequest.address_detail,
                                image_url: registerRestaurantRequest.image_url,
                            }
                        }
                    }
                }
            }
        });
    }

    // Registrasi admin
    static async registerAdmin(request: CreateAdminRequest) {
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

    static async getInfoConsumer(request: GetUserProfileRequest): Promise<ConsumerInfoResponse> {
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

        return toConsumerInfo(PersonalInformation!, MedicalHistory!);
    }

    static async getAllUserConsumer(): Promise<Array<AllUsersResponse>> {
        const users = await prismaClient.user.findMany({
            where: {
                consumer: {
                    isNot: null, // Mengambil hanya pengguna yang memiliki consumer
                },
            },
            include: {
                consumer: {
                    include: {
                        PersonalInformation: true, // Mengambil PersonalInformation dari consumer
                    },
                },
            },
        });

        if (!users || users.length === 0) {
            throw new ResponseError(404, "Tidak ada akun konsumen");
        }

        // Mapping data dengan fungsi toAllConsumers
        return users.map((user) => {
            const personalInformation = user.consumer?.PersonalInformation;
            if (personalInformation) {
                return toAllConsumers(user, personalInformation); // Memetakan ke AllUsersResponse menggunakan toAllConsumers
            } else {
                throw new ResponseError(404, `PersonalInformation tidak ditemukan untuk user ${user.id}`);
            }
        });
    }

    static async getAllUserRestaurant(): Promise<Array<AllUsersResponse>> {
        const users = await prismaClient.user.findMany({
            where: {
                restaurant: {
                    isNot: null, // Mengambil hanya pengguna yang memiliki consumer
                },
            },
            include: {
                restaurant: {
                    include: {
                        Contact: true,
                    },
                },
            },
        });

        if (!users || users.length === 0) {
            throw new ResponseError(404, "Tidak ditemukan akun restoran");
        }

        // Mapping data ke dalam bentuk yang diinginkan
        return users.map((user) => {
            const contact = user.restaurant?.Contact;
            if (contact) {
                return toAllRestaurant(user, contact); // Memetakan ke AllUsersResponse menggunakan toAllConsumers
            } else {
                throw new ResponseError(404, `Kontak tidak ditemukan untuk user ${user.id}`);
            }
        });
    }

    static async updateConsumer(request: UpdateConsumerRequest): Promise<ConsumerProfileResponse> {
        const requestUpdateConsumer: UpdateConsumerRequest = Validation.validate(UserValidation.UPDATECONSUMER, request);

        // Validasi logika: jika salah satu bernilai true, yang lainnya harus false
        const { no_history, diabetes, hypertension, cardiovascular } = requestUpdateConsumer;

        if (no_history === true) {
            requestUpdateConsumer.diabetes = false;
            requestUpdateConsumer.hypertension = false;
            requestUpdateConsumer.cardiovascular = false;
        } else if (diabetes === true) {
            requestUpdateConsumer.no_history = false;
            requestUpdateConsumer.hypertension = false;
            requestUpdateConsumer.cardiovascular = false;
        } else if (hypertension === true) {
            requestUpdateConsumer.no_history = false;
            requestUpdateConsumer.diabetes = false;
            requestUpdateConsumer.cardiovascular = false;
        } else if (cardiovascular === true) {
            requestUpdateConsumer.no_history = false;
            requestUpdateConsumer.diabetes = false;
            requestUpdateConsumer.hypertension = false;
        }

        // Hitung age jika birth diperbarui

        let age: number | undefined;
        let birth: Date | undefined;
        if (requestUpdateConsumer.birth) {
            birth = new Date(requestUpdateConsumer.birth);
            age = Number(await this.calculateAge(birth));
        }

        // Lakukan update pada user yang terhubung dengan consumer
        const updatedUser = await prismaClient.user.update({
            where: {
                id: requestUpdateConsumer.id,
            },
            data: {
                consumer: {
                    update: {
                        PersonalInformation: {
                            update: {
                                name: requestUpdateConsumer.name,
                                sex: requestUpdateConsumer.sex,
                                birth: birth,
                                phone: requestUpdateConsumer.phone,
                                height: requestUpdateConsumer.height,
                                weight: requestUpdateConsumer.weight,
                                ...(age !== undefined && { age }), // Hanya update age jika birth diperbarui
                            },
                        },
                        MedicalHistory: {
                            update: {
                                no_history: requestUpdateConsumer.no_history,
                                diabetes: requestUpdateConsumer.diabetes,
                                hypertension: requestUpdateConsumer.hypertension,
                                cardiovascular: requestUpdateConsumer.cardiovascular,
                            },
                        },
                    },
                },
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

        if (!updatedUser) {
            throw new ResponseError(404, `User with ID ${requestUpdateConsumer.id} not found`);
        }

        // Menggunakan fungsi toConsumerProfileResponse untuk mengembalikan hasil
        const { consumer } = updatedUser;
        // @ts-ignore
        const { PersonalInformation, MedicalHistory } = consumer;

        return toConsumerProfileResponse(updatedUser, PersonalInformation!, MedicalHistory!);
    }

    static async updateRestaurant(request: UpdateRestaurantRequest): Promise<RestaurantProfileResponse> {
        const requestUpdateRestaurant: UpdateRestaurantRequest = Validation.validate(UserValidation.UPDATERESTAURANT, request);

        const updatedUser = await prismaClient.user.update({
            where: {
                id: requestUpdateRestaurant.id,
            },
            data: {
                restaurant: {
                    update: {
                        Contact: {
                            update: {
                                name: requestUpdateRestaurant.name,
                                email: requestUpdateRestaurant.email,
                                phone: requestUpdateRestaurant.phone,
                            },
                        },
                        Address: {
                            update: {
                                province: requestUpdateRestaurant.province,
                                city: requestUpdateRestaurant.email,
                                address_detail: requestUpdateRestaurant.address_detail,
                                image_url: requestUpdateRestaurant.image_url,
                            },
                        },
                    },
                },
            },
            include: {
                restaurant: {
                    include: {
                        Contact: true,
                        Address: true,
                    },
                },
            },
        });

        if (!updatedUser) {
            throw new ResponseError(404, `User with ID ${requestUpdateRestaurant.id} not found`);
        }

        // Menggunakan fungsi toConsumerProfileResponse untuk mengembalikan hasil
        const { restaurant } = updatedUser;
        // @ts-ignore
        const { Contact, Address } = restaurant;

        return toRestaurantProfile(updatedUser, Contact!, Address!);
    }
}