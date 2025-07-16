import {
    AllUsersResponse,
    ConsumerInfoResponse,
    ConsumerProfileResponse,
    CreateConsumerRequest,
    CreateRestaurantRequest,
    GetUserProfileRequest,
    RestaurantProfileResponse,
    toAllConsumers,
    toAllRestaurant, toAllRestaurantsPublic,
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
    static async checkConsumer(consumerId: string) {
        const consumer = await prismaClient.consumer.findFirst({
            where: {
                consumer_id: consumerId
            },
            include: {
                user: true,
                PersonalInformation: true,
                MedicalHistory: true
            },
        });

        if (!consumer) {
            throw new ResponseError(404, "Konsumen tidak ditemukan");
        }

        return consumer;
    }

    static async checkRestaurant(restaurantId: string) {
        const restaurant = await prismaClient.restaurant.findFirst({
            where: {
                restaurant_id: restaurantId
            },
            include: {
                user: true,
                Contact: true,
                Address: true
            }
        });

        if (!restaurant) {
            throw new ResponseError(404, "Restoran tidak ditemukan");
        }

        return restaurant;
    }

    static async updateConsumerAge(userId: string): Promise<void> {
        const consumer = await this.checkConsumer(userId);

        if (consumer && consumer?.PersonalInformation?.birth) {
            const birthDate = consumer.PersonalInformation.birth;
            const today = new Date();

            // Hitung umur terkini
            const calculatedAge = await this.calculateAge(birthDate);

            // Jika hari ini ulang tahun, perbarui umur di database
            if (today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()) {
                await prismaClient.personalInformation.update({
                    where: {
                        consumer_id: consumer.consumer_id
                    },
                    data: {
                        age: calculatedAge
                    },
                });
            }
        }
    }

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

        if (totalUserWithSameEmail !== 0) {
            throw new ResponseError(409, "Email telah digunakan pengguna lain");
        }

        if (registerConsumerRequest.password !== registerConsumerRequest.password_confirmation) {
            throw new ResponseError(400, "Password dan konfirmasi password tidak sama");
        }

        if(registerConsumerRequest.medical_history == "no_history"){
            registerConsumerRequest.no_history = true;
        }

        if(registerConsumerRequest.medical_history == "diabetes"){
            registerConsumerRequest.diabetes = true;
        }

        if(registerConsumerRequest.medical_history == "cardiovascular"){
            registerConsumerRequest.cardiovascular = true;
        }

        if(registerConsumerRequest.medical_history == "hypertension"){
            registerConsumerRequest.hypertension = true;
        }

        registerConsumerRequest.password = await bcrypt.hash(registerConsumerRequest.password, 10);

        const birth = new Date(registerConsumerRequest.birth);
        const age = Number(await this.calculateAge(birth));

        const consumer_id = String(`C-${uuid7()}`);

        await prismaClient.user.create({
            data: {
                id: consumer_id,
                email: registerConsumerRequest.email,
                password: registerConsumerRequest.password,
                role: "Konsumen",
                consumer: {
                    create: {
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
            throw new ResponseError(409, "Email is already taken");
        }

        if (registerRestaurantRequest.password != registerRestaurantRequest.password_confirmation) {
            throw new ResponseError(400, "Password dan konfirmasi password tidak sama");
        }

        registerRestaurantRequest.password = await bcrypt.hash(registerRestaurantRequest.password, 10);

        const restaurant_id = String(`R-${uuid7()}`);

        await prismaClient.user.create({
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

    // Mendapatkan detail spesifik user
    static async getProfileConsumer(request: GetUserProfileRequest): Promise<ConsumerProfileResponse> {
        const requestProfileConsumer = Validation.validate(UserValidation.GETUSERPROFILE, request);

        const consumer = await this.checkConsumer(requestProfileConsumer.id)

        return toConsumerProfileResponse(consumer.user, consumer.PersonalInformation!, consumer.MedicalHistory!);
    }

    static async getProfileRestaurant(request: GetUserProfileRequest): Promise<RestaurantProfileResponse> {
        const requestProfileRestaurant = Validation.validate(UserValidation.GETUSERPROFILE, request);

        const restaurant = await this.checkRestaurant(requestProfileRestaurant.id);

        return toRestaurantProfile(restaurant.user, restaurant.Contact!, restaurant.Address!);
    }

    static async getInfoConsumer(request: GetUserProfileRequest): Promise<ConsumerInfoResponse> {
        const requestInfoConsumer = Validation.validate(UserValidation.GETUSERPROFILE, request);

        await this.updateConsumerAge(requestInfoConsumer.id);

        const consumer = await this.checkConsumer(requestInfoConsumer.id)

        return toConsumerInfo(consumer.PersonalInformation!, consumer.MedicalHistory!);
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

        const { no_history, diabetes, hypertension, cardiovascular } = requestUpdateConsumer;

        // Validasi hanya satu kondisi true
        const trueCount = [no_history, diabetes, hypertension, cardiovascular].filter(Boolean).length;

        if (trueCount > 1) {
            throw new ResponseError(400, "Hanya satu dari no_history, diabetes, hypertension, atau cardiovascular yang boleh bernilai true");
        }

        if(requestUpdateConsumer.medical_history == "no_history"){
            requestUpdateConsumer.no_history = true;
            requestUpdateConsumer.diabetes = false;
            requestUpdateConsumer.hypertension = false;
            requestUpdateConsumer.cardiovascular = false;
        }

        if(requestUpdateConsumer.medical_history == "diabetes"){
            requestUpdateConsumer.diabetes = true;
            requestUpdateConsumer.no_history = false;
            requestUpdateConsumer.hypertension = false;
            requestUpdateConsumer.cardiovascular = false;
        }

        if(requestUpdateConsumer.medical_history == "cardiovascular"){
            requestUpdateConsumer.cardiovascular = true;
            requestUpdateConsumer.no_history = false;
            requestUpdateConsumer.diabetes = false;
            requestUpdateConsumer.hypertension = false;
        }

        if(requestUpdateConsumer.medical_history == "hypertension"){
            requestUpdateConsumer.hypertension = true;
            requestUpdateConsumer.no_history = false;
            requestUpdateConsumer.diabetes = false;
            requestUpdateConsumer.cardiovascular = false;
        }

        // Hitung age jika birth diperbarui
        let age: number | undefined;
        let birth: Date | undefined;
        if (requestUpdateConsumer.birth) {
            birth = new Date(requestUpdateConsumer.birth);
            age = Number(await this.calculateAge(birth));
        }

        await prismaClient.user.update({
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
            }
        });

        const consumer = await this.checkConsumer(requestUpdateConsumer.id)

        return toConsumerProfileResponse(consumer.user, consumer.PersonalInformation!, consumer.MedicalHistory!);
    }

    static async updateRestaurant(request: UpdateRestaurantRequest) {
        const validatedRequest = Validation.validate(UserValidation.UPDATERESTAURANT, request);

        await prismaClient.user.update({
            where: { id: validatedRequest.id },
            data: {
                restaurant: {
                    update: {
                        Contact: {
                            update: {
                                ...(validatedRequest.name && { name: validatedRequest.name }),
                                ...(validatedRequest.email && { email: validatedRequest.email }),
                                ...(validatedRequest.phone && { phone: validatedRequest.phone }),
                            },
                        },
                        Address: {
                            update: {
                                ...(validatedRequest.province && { province: validatedRequest.province }),
                                ...(validatedRequest.city && { city: validatedRequest.city }),
                                ...(validatedRequest.address_detail && { address_detail: validatedRequest.address_detail }),
                                ...(validatedRequest.image_url && { image_url: validatedRequest.image_url }),
                            },
                        },
                    },
                },
            },
        });
        const restaurant = await this.checkRestaurant(validatedRequest.id);
        return toRestaurantProfile(restaurant.user, restaurant.Contact!, restaurant.Address!);
    }


    static async getAllRestaurantPublic() {
        const restaurants = await prismaClient.contact.findMany();
        // Mapping data ke dalam bentuk yang diinginkan
        return restaurants.map(restaurant => toAllRestaurantsPublic(restaurant));
    }
}