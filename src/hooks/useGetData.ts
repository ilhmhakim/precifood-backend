import { useEffect, useState } from "react";

import { openToast } from "@/components/Toast";
import {
  GET_MENUS,
  GET_ORDERS,
  GET_RECOMMENDATIONS,
  PROFILE,
  GET_RESTAURANTS,
  GET_RESTAURANT_PROFILE,
  Endpoint,
} from "@/constants/endpoint";
import { IndexRecommendation, Menu } from "@/interfaces/menu";
import { SimpleOrder } from "@/interfaces/order";
import { getDataAuthenticated } from "@/utils/http";
import { Profile } from "@/interfaces/profile";
import { Restaurant, ListRestaurant } from "@/interfaces/restaurant";

function useFetchData<T>(endpoint: Endpoint) {
  const [data, setData] = useState<T | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataAuthenticated(endpoint());
        setData(response);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          openToast({ type: "error", message: error.message });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, errorMessage, isLoading, setData };
}

export const useGetOrders = () => useFetchData<SimpleOrder[]>(GET_ORDERS);
export const useGetRecommendations = () =>
  useFetchData<IndexRecommendation>(GET_RECOMMENDATIONS);
export const useGetMenus = () => useFetchData<Menu[]>(GET_MENUS);
export const useGetProfile = () => useFetchData<Profile>(PROFILE);
export const useGetRestaurants = () => useFetchData<ListRestaurant[]>(GET_RESTAURANTS);
export const useGetRestaurantProfile = () => useFetchData<Restaurant>(GET_RESTAURANT_PROFILE);