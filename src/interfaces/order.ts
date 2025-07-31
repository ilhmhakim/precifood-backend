export interface Order {
  id: number;
  restaurant_name: string;
  total_price: number;
  ordered_at: number;
  description: string;
  order_detail: OrderDetail[];
}

export interface SimpleOrder {
  id: number;
  restaurant_name: string;
  total_price: number;
  ordered_at: number;
  description: string;
}

export interface OrderDetail {
  id: number;
  menu_id: number;
  menu_name: string;
  menu_category: string;
  menu_price: number;
  menu_portion: string;
}

export interface SuccessOrder {
  consumer_name: string;
  restaurant_name: string;
  total_price: number;
  description: string;
}
