import {Request, Response, NextFunction, request} from "express";
import {
    CreateOrderRequest,
    GetAllOrdersRequest,
    GetOrderDetailRequest
} from "../model/order-model";
import {OrderService} from "../service/order-service";
import {UserRequest} from "../type/user";
import {Validation} from "../validation/validation";
import {OrderValidation} from "../validation/order-validation";
import {prismaClient} from "../application/database";

export class OrderController {
    static async createOrder(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateOrderRequest = {
                recommendation_id: Number(req.params.recommendationId)
            }
            const response = await OrderService.createOrder(request);
            res.status(201).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async getAllOrder(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetAllOrdersRequest = {
                consumer_id: req.user.id
            }
            const response = await OrderService.getAllOrder(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }


    }

    static async getOrderDetail(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetOrderDetailRequest = {
                consumer_id: req.user.id,
                order_id: Number(req.params.orderId)
            };

            const response = await OrderService.getOrderDetail(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}