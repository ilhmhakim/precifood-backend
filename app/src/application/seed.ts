import { Request, Response, NextFunction } from 'express';
import { prismaClient } from './database';
import { consumerSeed, restaurantSeed, menuSeed, adminSeed } from './seed-data';
import bcrypt from 'bcrypt'; // Pastikan menuSeed di-import

export async function Seed(req: Request, res: Response, next: NextFunction) {
    try {
        // Seed Konsumen
        const consumer = await prismaClient.user.create({
            data: {
                id: String(consumerSeed.id),
                email: consumerSeed.email,
                password: await bcrypt.hash(consumerSeed.password, 10),
                role: 'Konsumen',
                consumer: {
                    create: {
                        PersonalInformation: {
                            create: {
                                name: consumerSeed.name,
                                sex: consumerSeed.sex,
                                weight: consumerSeed.weight,
                                height: consumerSeed.height,
                                age: 21,
                                birth: new Date(consumerSeed.birth),
                                phone: consumerSeed.phone,
                            },
                        },
                        MedicalHistory: {
                            create: {
                                no_history: consumerSeed.no_history,
                                diabetes: consumerSeed.diabetes,
                                hypertension: consumerSeed.hypertension,
                                cardiovascular: consumerSeed.cardiovascular,
                            },
                        },
                    },
                },
            },
        });

        // Seed Restoran
        const restaurant = await prismaClient.user.create({
            data: {
                id: String(restaurantSeed.id),
                email: restaurantSeed.email,
                password: await bcrypt.hash(restaurantSeed.password, 10),
                role: 'Restoran',
                restaurant: {
                    create: {
                        Contact: {
                            create: {
                                name: restaurantSeed.name,
                                email: restaurantSeed.email,
                                phone: restaurantSeed.phone,
                            },
                        },
                        Address: {
                            create: {
                                province: restaurantSeed.province,
                                city: restaurantSeed.city,
                                address_detail: restaurantSeed.address_detail,
                                image_url: restaurantSeed.image_url,
                            },
                        },
                    },
                },
            },
        });

        // Seed Menu untuk Restoran
        for (const menu of menuSeed) {
            await prismaClient.menu.create({
                data: {
                    name: menu.name,
                    category: menu.category,
                    portion: menu.portion,
                    price: menu.price,
                    status: menu.status,
                    description: menu.description,
                    image_url: menu.image_url,
                    restaurant_id: restaurantSeed.id, // Sesuaikan dengan restaurant_id yang dihasilkan
                    Nutrition: {
                        create: {
                            weight_per_portion: menu.weight_per_portion,
                            weight_with_bdd: menu.weight_with_bdd,
                            calory: menu.calory,
                            protein: menu.protein,
                            fat: menu.fat,
                            carbohydrate: menu.carbohydrate,
                            fiber: menu.fiber,
                            natrium: menu.natrium,
                            cholesterol: menu.cholesterol,
                            mufa: menu.mufa,
                            pufa: menu.pufa,
                            sfa: menu.sfa,
                        },
                    },
                },
            });
        }

        // Seed Admin
        const admin = await prismaClient.user.create({
            data: {
                id: String(adminSeed.id),
                email: adminSeed.email,
                password: await bcrypt.hash(adminSeed.password, 10),
                role: 'Admin',
                admin: {
                    create: {},
                },
            },
        });

        res.status(200).json({
            message: 'Seed data has been successfully added!',
        });
    } catch (e) {
        next(e);
    }
}
