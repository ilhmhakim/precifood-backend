import {MenuResponse} from "./menu-model";
import {Consumer, Order, OrderDetail, PersonalInformation} from "@prisma/client";

export type OrderResponse = {
    id: number;
    restaurant_name: string;
    total_price: number;
    ordered_at: string;
    order_detail?:
        {
            id: number;
            menu_id: number;
            menu_name: string;
            menu_category: string;
            menu_price: number;
        } [];
}


export type GetAllOrdersRequest = {
    consumer_id: string;
}

export type GetOrderDetailRequest = {
    consumer_id: string;
    order_id: number;
}

export type CreateOrderRequest = {
    recommendation_id: number;
}

export type CreateOrderResponse = {
    consumer_name: string;
    restaurant_name: string;
    total_price: number;
}

export function toAllOrderResponse(order: Order): OrderResponse {
    return {
        id: order.id,
        restaurant_name: order.restaurant_name,
        total_price: order.total_price,
        ordered_at: order.ordered_at.toLocaleDateString()
    }
}

export function toOrderDetailResponse(order: Order, orderDetails: OrderDetail[]): OrderResponse {
    return {
        id: order.id,
        restaurant_name: order.restaurant_name,
        total_price: order.total_price,
        ordered_at: order.ordered_at.toLocaleDateString(),
        order_detail: orderDetails.map((detail) => ({
            id: detail.id,
            menu_id: detail.menu_id,
            menu_name: detail.menu_name,
            menu_category: detail.menu_category,
            menu_price: detail.menu_price,
        }))
    };
}

export function toCreateOrderResponse(consumer: PersonalInformation, order: Order): CreateOrderResponse {
    return {
        consumer_name: consumer.name,
        restaurant_name: order.restaurant_name,
        total_price: order.total_price
    }
}