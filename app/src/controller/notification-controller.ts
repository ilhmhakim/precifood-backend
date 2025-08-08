import { UpdateNotificationReadRequest } from '../model/notification-model';
import { NotificationService } from '../service/notification-service';
import { Request, Response, NextFunction } from 'express';

export class NotificationController {
  static async getNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await NotificationService.getNotification();
      return res.status(200).json({
        message: 'Success!',
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async updateNotificationRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: UpdateNotificationReadRequest =
        req.body as UpdateNotificationReadRequest;
      request.id = Number(req.params.notificationId);

      await NotificationService.updateNotificationRead(request);

      return res.status(200).json({
        message: 'Success!',
      });
    } catch (e) {
      next(e);
    }
  }
}
