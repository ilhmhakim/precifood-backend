import { useState } from "react";

import { openToast } from "@/components/Toast";
import { SEARCH_MENUS } from "@/constants/endpoint";
import { Menu } from "@/interfaces/menu";
import { getDataAuthenticated } from "@/utils/http";

export function useSearchMenus() {
  const [searchedMenus, setSearchedMenus] = useState<Menu[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setIsSearchActive(true);
    try {
      const data = await getDataAuthenticated(SEARCH_MENUS(query));
      setSearchedMenus(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        openToast({ type: "error", message: error.message });
      }
      setSearchedMenus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSearch = () => {
    setSearchedMenus(null);
    setIsSearchActive(false);
  };

  return {
    searchedMenus,
    isLoading,
    errorMessage,
    isSearchActive,
    handleSearch,
    handleCancelSearch,
  };
}
