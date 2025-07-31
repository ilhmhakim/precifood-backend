import { useState } from "react";

import FilterButtons from "@/components/FilterButtons";
import MenuCard from "@/components/menu/MenuCard";
import { MENU_CATEGORIES, Menu } from "@/interfaces/menu";

export default function MenuList({ menulist }: { menulist: Menu[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [filteredMenuList, setFilteredMenuList] = useState<Menu[]>(menulist);
  const [priceOrderState, setPriceOrderState] = useState<number>(0);

  const filterMenuList = (category: string) => {
    setSelectedCategory(category);
    if (category === "Semua") {
      setFilteredMenuList(menulist);
    } else {
      setFilteredMenuList(
        menulist.filter(
          (menu) => menu.category.toLowerCase() === category.toLowerCase(),
        ),
      );
    }
  };

  const togglePriceOrder = () => {
    const newState = (priceOrderState + 1) % 2 === 0 ? 2 : 1;
    setPriceOrderState(newState);

    const sortedMenu = [...filteredMenuList].sort((a, b) =>
      newState === 1 ? a.price - b.price : b.price - a.price,
    );
    setFilteredMenuList(sortedMenu);
  };

  return (
    <div className="space-y-2">
      <FilterButtons
        categories={MENU_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={filterMenuList}
        onTogglePriceOrder={togglePriceOrder}
        priceOrderState={priceOrderState}
      />
      {filteredMenuList.length > 0 ? (
        filteredMenuList.map((menu) => <MenuCard menu={menu} key={menu.id} />)
      ) : (
        <div className="flex flex-col justify-center items-center h-64 text-center text-gray-500">
          <p className="text-base font-semibold">
            Oops! <br />
            Sepertinya belum ada menu di kategori ini
          </p>
          <p className="text-sm">
            Kami akan segera menambahkannya. <br />
            Silakan cek kembali nanti!
          </p>
        </div>
      )}
    </div>
  );
}
