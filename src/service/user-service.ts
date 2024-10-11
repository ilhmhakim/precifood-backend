import {CreateConsumerRequest, toUserResponse, UserResponse} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {v7 as uuid7} from "uuid";


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

        if (registerConsumerRequest.password != registerConsumerRequest.password) {
            throw new ResponseError(400, "Password and Password Confirmation is already taken");
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
                                // @ts-ignore
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
}