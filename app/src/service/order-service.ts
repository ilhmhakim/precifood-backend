import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
    CancelOrderRequest,
    CreateOrderRequest,
    CreateOrderResponse,
    GetAllOrdersRequest,
    GetOrderDetailRequest,
    OrderResponse,
    toAllOrderResponse,
    toCreateOrderResponse,
    toOrderDetailResponse,
    UpdateOrderRequest,
} from '../model/order-model';
import { OrderValidation } from '../validation/order-validation';
import { Validation } from '../validation/validation';
import { RecommendationService } from './recommendation-service';

export class OrderService {
    static async checkOrder(consumer_id: string, order_id: number) {
        const order = await prismaClient.order.findFirst({
            where: {
                consumer_id: consumer_id,
                id: order_id,
            },
            include: {
                OrderDetail: true,
            },
        });

        if (!order) {
            throw new ResponseError(
                404,
                `Order dengan id ${order_id} tidak ditemukan`
            );
        }

        return order;
    }

    static async createOrder(
        request: CreateOrderRequest
    ): Promise<CreateOrderResponse> {
        const createOrderRequest = Validation.validate(
            OrderValidation.CREATEORDER,
            request
        );

        // Cari recommendation list berdasarkan recommendation_id dan include data Recommendation
        const recommendationList =
            await RecommendationService.checkRecommendationDetail(
                createOrderRequest.recommendation_id,
                createOrderRequest.consumer_id
            );

        // Buat order beserta detailnya dengan data dari Recommendation
        const order = await prismaClient.order.create({
            data: {
                restaurant_id: recommendationList.recommendation.restaurant_id, // Ambil dari Recommendation
                consumer_id: recommendationList.recommendation.consumer_id, // Ambil dari Recommendation
                restaurant_name:
                    recommendationList.recommendation.restaurant_name, // Ambil dari Recommendation
                total_price: recommendationList.total_price, // Total price dari recommendation list
                description: recommendationList.description,
                OrderDetail: {
                    createMany: {
                        data: recommendationList.RecommendationListDetail.map(
                            (detail) => ({
                                menu_id: detail.menu_id,
                                menu_name: detail.menu_name,
                                menu_category: detail.menu_category,
                                menu_price: detail.menu_price,
                                menu_portion: detail.menu_portion,
                            })
                        ),
                    },
                },
            },
            include: {
                consumer: {
                    include: {
                        PersonalInformation: true,
                    },
                },
            },
        });

        // Menggunakan fungsi toOrderResponse untuk mengembalikan hasil
        return toCreateOrderResponse(
            order.consumer.PersonalInformation!,
            order
        );
    }

    static async getAllOrder(
        request: GetAllOrdersRequest
    ): Promise<Array<OrderResponse>> {
        const requestGetAllOrder = Validation.validate(
            OrderValidation.GETALLORDER,
            request
        );

        const orders = await prismaClient.order.findMany({
            where: {
                consumer_id: requestGetAllOrder.consumer_id,
            },
        });

        if (orders.length === 0) {
            throw new ResponseError(404, 'Belum ada order yang dipesan');
        }

        return orders.map((order) => toAllOrderResponse(order));
    }

    static async getOrderDetail(
        request: GetOrderDetailRequest
    ): Promise<OrderResponse> {
        const requestOrderDetail = Validation.validate(
            OrderValidation.GETORDERDETAIL,
            request
        );

        const order = await this.checkOrder(
            requestOrderDetail.consumer_id,
            requestOrderDetail.order_id
        );

        return toOrderDetailResponse(order, order.OrderDetail);
    }

    static async updateOrderStatus(request: UpdateOrderRequest) {
        const requestOrderStatusUpdate = Validation.validate(
            OrderValidation.GETORDERDETAIL,
            request
        );

        const order = await this.checkOrder(
            requestOrderStatusUpdate.consumer_id,
            requestOrderStatusUpdate.order_id
        );

        if (order.status == 'Confirmed') {
            throw new ResponseError(
                403,
                'Order yang telah terkonfirmasi tidak dapat diupdate lagi'
            );
        }

        await prismaClient.order.update({
            where: {
                consumer_id: requestOrderStatusUpdate.consumer_id,
                id: requestOrderStatusUpdate.order_id,
            },
            data: {
                status: 'Confirmed',
            },
        });
    }

    static async cancelOrder(request: CancelOrderRequest) {
        const requestCancelOrder = Validation.validate(
            OrderValidation.GETORDERDETAIL,
            request
        );

        const order = await this.checkOrder(
            requestCancelOrder.consumer_id,
            requestCancelOrder.order_id
        );

        // Cek status order
        if (order.status === 'Confirmed') {
            throw new ResponseError(
                403,
                'Order yang telah terkonfirmasi tidak dapat dicancel'
            );
        }

        // Hitung selisih waktu antara `ordered_at` dan waktu sekarang
        const now = new Date();
        const timeDifference = now.getTime() - order.ordered_at.getTime(); // Hasil dalam milidetik
        const oneHourInMs = 60 * 60 * 1000; // 1 jam dalam milidetik

        if (timeDifference > oneHourInMs) {
            throw new ResponseError(
                403,
                'Order tidak dapat dicancel karena sudah lebih dari 1 jam sejak pemesanan'
            );
        }

        // Hapus order
        await prismaClient.order.delete({
            where: {
                consumer_id: requestCancelOrder.consumer_id,
                id: requestCancelOrder.order_id, // Pastikan order_id dicocokkan di level Order
            },
        });
    }
}
