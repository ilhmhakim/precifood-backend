import { Notification } from '@prisma/client';

export type NotificationResponse = {
    id: number;
    title: string;
    restaurant_name: string;
    restaurant_id: string;
    menu_id: number;
    menu_name: string;
    is_read: boolean;
};

export type CreateNotificationRequest = {
    title: string;
    restaurant_name: string;
    restaurant_id: string;
    menu_id: number;
    menu_name: string;
    is_read: boolean;
};

export type UpdateNotificationReadRequest = {
    id: number;
    is_read: boolean;
};

export function toNotificationResponse(
    notification: Notification
): NotificationResponse {
    return {
        id: notification.id,
        title: notification.title,
        restaurant_name: notification.restaurant_name,
        restaurant_id: notification.restaurant_id,
        menu_id: notification.menu_id,
        menu_name: notification.menu_name,
        is_read: notification.is_read,
    };
}
