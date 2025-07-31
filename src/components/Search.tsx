import { useState } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper } from "@mui/material";

interface SearchProps {
  onSearch: (query: string) => void;
  onCancelSearch: () => void;
  isSearchActive: boolean;
}

export default function Search({
  onSearch,
  onCancelSearch,
  isSearchActive,
}: SearchProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <Paper
      component="form"
      className="p-1 flex items-center"
      onSubmit={handleSearch}
    >
      <InputBase
        className="ml-2 flex-1"
        placeholder="Cari Makanan"
        inputProps={{ "aria-label": "search makanan" }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {isSearchActive && (
        <IconButton
          className="p-2"
          aria-label="cancel search"
          onClick={() => {
            setSearchInput("");
            onCancelSearch();
          }}
        >
          <CancelIcon />
        </IconButton>
      )}
      <IconButton type="submit" className="p-2" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
