export type NotificationResponse = {
    id: number;
    title: string;
    restaurant_name: string;
    restaurant_id: string;
    menu_id: number;
    menu_name: string;
    is_read: boolean;
}

export type CreateNotificationRequest = {
    title: string;
    restaurant_name: string;
    restaurant_id: string;
    menu_id: number;
    menu_name: string;
    is_read: boolean;
}