import { prismaClient } from '../application/database';
import {
  CancelOrderRequest,
  CreateOrderRequest,
  GetAllOrdersRequest,
  GetOrderDetailRequest,
  UpdateOrderRequest,
} from '../model/order-model';
import { OrderService } from '../service/order-service';
import { UserRequest } from '../type/user';
import { OrderValidation } from '../validation/order-validation';
import { Validation } from '../validation/validation';
import { Request, Response, NextFunction, request } from 'express';

export class OrderController {
  static async createOrder(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: CreateOrderRequest = {
        consumer_id: String(req.user.id),
        recommendation_id: Number(req.params.recommendationId),
      };
      const response = await OrderService.createOrder(request);
      res.status(201).json({
        message: 'Pesanan berhasil! Silahkan sampaikan pesanan kepada waitress',
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAllOrder(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: GetAllOrdersRequest = {
        consumer_id: req.user.id,
      };
      const response = await OrderService.getAllOrder(request);
      res.status(200).json({
        message: 'Success!',
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getOrderDetail(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: GetOrderDetailRequest = {
        consumer_id: req.user.id,
        order_id: Number(req.params.orderId),
      };

      const response = await OrderService.getOrderDetail(request);

      res.status(200).json({
        message: 'Success!',
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async updateOrderStatus(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: UpdateOrderRequest = {
        consumer_id: req.user.id,
        order_id: Number(req.params.orderId),
      };

      const response = await OrderService.updateOrderStatus(request);
      res.status(200).json({
        message: 'Success!',
      });
    } catch (e) {
      next(e);
    }
  }

  static async cancelOrder(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: CancelOrderRequest = {
        consumer_id: req.user.id,
        order_id: Number(req.params.orderId),
      };

      await OrderService.cancelOrder(request);
      res.status(200).json({
        message: 'Success!',
      });
    } catch (e) {
      next(e);
    }
  }
}
