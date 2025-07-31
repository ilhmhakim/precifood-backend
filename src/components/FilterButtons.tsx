import SwapVertIcon from "@mui/icons-material/SwapVert";
import Button from "@mui/material/Button";

interface CategoryFilterProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onTogglePriceOrder: () => void;
  priceOrderState: number;
}

export default function FilterButtons({
  categories,
  selectedCategory,
  onSelectCategory,
  onTogglePriceOrder,
  priceOrderState,
}: CategoryFilterProps) {
  const getPriceOrderText = (state: number) =>
    state === 1 ? "Termurah" : "Termahal";

  return (
    <div className="flex overflow-x-auto whitespace-nowrap space-x-2 scrollbar-hide">
      <Button
        variant={priceOrderState === 0 ? "outlined" : "contained"}
        startIcon={<SwapVertIcon />}
        className="border rounded-full px-5 py-2 flex-shrink-0"
        onClick={onTogglePriceOrder}
      >
        {getPriceOrderText(priceOrderState)}
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "contained" : "outlined"}
          className="border rounded-full px-5 py-2 flex-shrink-0"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
