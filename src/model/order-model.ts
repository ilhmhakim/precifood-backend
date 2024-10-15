import {MenuResponse} from "./menu-model";

export type AllOrdersResponse = {
    id: number;
    consumer_id: string;
    restaurant_id: string;
    restaurant_name: string;
    total_price: number;
    ordered_at: string;
}

export type GetAllOrdersRequest = {
    consumer_id: string;
}

export type GetOrderDetailRequest = {
    consumer_id: string;
    order_id: number;
}

export type CreateOrderRequest = {
    restaurant_name: string;
    total_price: number;
    detail: MenuResponse[];
}