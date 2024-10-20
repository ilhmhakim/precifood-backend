import {NextFunction, request} from "express";
import {
    CreateOrderRequestSeed,
    GetAllOrdersRequest,
    GetOrderDetailRequest,
    OrderResponse, toAllOrderResponse,
    toOrderResponse
} from "../model/order-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {OrderValidation} from "../validation/order-validation";

export class OrderService {
    static async createOrder(request: CreateOrderRequestSeed): Promise<OrderResponse> {
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

    static async getAllOrder(request: GetAllOrdersRequest): Promise<Array<OrderResponse>> {
        const requestGetAllOrder = Validation.validate(OrderValidation.GETALLORDER, request)

        const orders = await prismaClient.order.findMany({
           where: {
               consumer_id: requestGetAllOrder.consumer_id
           }
        });

        return orders.map((order) => toAllOrderResponse(order));
    }

    static async getOrderDetail(request: GetOrderDetailRequest): Promise<OrderResponse> {
        const requestOrderDetail = Validation.validate(OrderValidation.GETORDERDETAIL, request);

        // Cari order berdasarkan consumer_id dan order_id
        const order = await prismaClient.order.findFirst({
            where: {
                consumer_id: requestOrderDetail.consumer_id,
                id: requestOrderDetail.order_id // Pastikan order_id dicocokkan di level Order
            },
            include: {
                OrderDetail: true // Ambil semua OrderDetail terkait dengan order ini
            }
        });

        // Handle jika order tidak ditemukan
        if (!order) {
            throw new Error('Order not found');
        }

        return toOrderResponse(order, order.OrderDetail);
    }

}
