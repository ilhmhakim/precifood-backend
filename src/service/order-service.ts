import {
    CreateOrderRequest, CreateOrderResponse,
    GetAllOrdersRequest,
    GetOrderDetailRequest,
    OrderResponse,
    toAllOrderResponse, toCreateOrderResponse,
    toOrderDetailResponse
} from "../model/order-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {OrderValidation} from "../validation/order-validation";
import {ResponseError} from "../error/response-error";

export class OrderService {
    static async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
        // Validasi input request
        const createOrderRequest = Validation.validate(OrderValidation.CREATEORDER, request);

        // Cari recommendation list berdasarkan recommendation_id dan include data Recommendation
        const recommendationList = await prismaClient.recommendationList.findFirst({
            where: {
                id: createOrderRequest.recommendation_id
            },
            include: {
                recommendation: true, // Include Recommendation untuk mendapatkan data restaurant, consumer, dll
                RecommendationListDetail: true // Include detail dari recommendation list
            }
        });

        // Jika recommendation list tidak ditemukan, lemparkan error
        if (!recommendationList) {
            throw new ResponseError(404, "Recommendation list not found");
        }

        // Buat order beserta detailnya dengan data dari Recommendation
        const order = await prismaClient.order.create({
            data: {
                restaurant_id: recommendationList.recommendation.restaurant_id, // Ambil dari Recommendation
                consumer_id: recommendationList.recommendation.consumer_id,     // Ambil dari Recommendation
                restaurant_name: recommendationList.recommendation.restaurant_name, // Ambil dari Recommendation
                total_price: recommendationList.total_price, // Total price dari recommendation list
                description: recommendationList.description,
                OrderDetail: {
                    createMany: {
                        data: recommendationList.RecommendationListDetail.map(detail => ({
                            menu_id: detail.menu_id,
                            menu_name: detail.menu_name,
                            menu_category: detail.menu_category,
                            menu_price: detail.menu_price
                        }))
                    }
                }
            },
            include: {
                consumer: {
                    include: {
                        PersonalInformation: true,
                    }
                },
            }
        });

        // Menggunakan fungsi toOrderResponse untuk mengembalikan hasil
        return toCreateOrderResponse(order.consumer.PersonalInformation!, order);
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
            throw new ResponseError(404, 'Order tidak ditemukan');
        }

        return toOrderDetailResponse(order, order.OrderDetail);
    }

}
