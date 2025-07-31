import { useCallback, useRef, useState } from "react";
import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, IconButton } from "@mui/material";

import MenuDialogContent from "@/components/menu/MenuDialogContent";
import { Menu } from "@/interfaces/menu";
import { getDataAuthenticated } from "@/utils/http";
import { getCookies } from "@/utils/cookie";

export default function InfoMenuDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const menuFetched = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      if (menuFetched.current) return;
      const data = await getDataAuthenticated(
        `/restaurants/${getCookies("restaurant_id")}/menus/${id}`,
      );
      setMenu(data);
      menuFetched.current = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [id]);

  const openInfoMenuDialog = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        className="rounded-3xl"
        size="small"
        variant="contained"
        onClick={openInfoMenuDialog}
      >
        Lihat
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
        >
          <CloseIcon />
        </IconButton>
        {menu ? <MenuDialogContent menu={menu} /> : null}
      </Dialog>
    </div>
  );
}
