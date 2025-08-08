import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
  NotificationResponse,
  toNotificationResponse,
  UpdateNotificationReadRequest,
} from '../model/notification-model';
import { NotificationValidation } from '../validation/notification-validation';
import { Validation } from '../validation/validation';

export class NotificationService {
  static async getNotification(): Promise<Array<NotificationResponse>> {
    const notifications = await prismaClient.notification.findMany();

    if (!notifications) {
      throw new ResponseError(404, 'Belum ada notifikasi');
    }

    return notifications.map((notification) =>
      toNotificationResponse(notification)
    );
  }

  static async updateNotificationRead(
    request: UpdateNotificationReadRequest
  ): Promise<void> {
    const updateNotificationReadRequest = Validation.validate(
      NotificationValidation.UPDATENOTIFICATIONREAD,
      request
    );

    if (updateNotificationReadRequest.is_read !== true) {
      throw new ResponseError(400, 'is_read harus bernilai true');
    }

    await prismaClient.notification.update({
      where: {
        id: updateNotificationReadRequest.id,
      },
      data: {
        is_read: updateNotificationReadRequest.is_read,
      },
    });
  }
}
