import { getCookies } from "@/utils/cookie";

export type Endpoint = (query?: string) => string;

export const GET_ORDERS: Endpoint = () => `/consumers/orders`;
export const PROFILE: Endpoint = () => `/users/consumers/profile`;
export const GET_RESTAURANTS: Endpoint = () => `/list/restaurant`;
export const GET_RECOMMENDATIONS: Endpoint = () => `/restaurants/${getCookies("restaurant_id")}/recommendations`;
export const GET_MENUS: Endpoint = () => `/restaurants/${getCookies("restaurant_id")}/menus`;
export const GET_RESTAURANT_PROFILE: Endpoint = () => `/users/restaurants/${getCookies("restaurant_id")}`;
export const SEARCH_MENUS: Endpoint = (query?: string) => `/restaurants/${getCookies("restaurant_id")}/menus/search?name=${query}`;