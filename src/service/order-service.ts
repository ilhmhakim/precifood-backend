import {NextFunction} from "express";
import {CreateOrderRequest, OrderResponse, toOrderResponse} from "../model/order-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {OrderValidation} from "../validation/order-validation";

export class OrderService {
    static async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
        const createOrderRequest = Validation.validate(OrderValidation.CREATEORDER, request);

        // Membuat order beserta detailnya
        const order = await prismaClient.order.create({
            data: {
                consumer_id: createOrderRequest.consumer_id,
                restaurant_id: createOrderRequest.restaurant_id,
                restaurant_name: createOrderRequest.restaurant_name,
                total_price: createOrderRequest.total_price,
                OrderDetail: {
                    createMany: {
                        data: createOrderRequest.detail.map((item) => ({
                            menu_id: item.menu_id,
                            menu_name: item.menu_name,
                            menu_category: item.menu_category,
                            menu_price: item.menu_price,
                        }))
                    }
                }
            },
            include: {
                OrderDetail: true // Include OrderDetail to return it in response
            }
        });

        // Menggunakan fungsi toOrderResponse untuk mengembalikan hasil
        return toOrderResponse(order, order.OrderDetail);
    }
}
