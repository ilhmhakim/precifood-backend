import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const routeToValue: { [key: string]: number } = {
  "/restaurant": 0,
  "/menus": 1,
  "/": 2,
  "/history": 3,
  "/profile": 4,
};

const theme = createTheme({
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "black",
          },
        },
      },
    },
  },
});

export default function BottomNav() {
  const router = useRouter();
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(routeToValue[router.pathname as keyof typeof routeToValue] || 0);
  }, [router.pathname]);

  return (
    <Paper className="fixed bottom-0 left-0 right-0 z-10" elevation={3}>
      <ThemeProvider theme={theme}>
        <BottomNavigation
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          className="bg-primary"
        >
          <BottomNavigationAction
            icon={<RestaurantMenuIcon />}
            component={Link}
            href="/restaurant"
            className="text-secondary hover:text-gray"
          />
          <BottomNavigationAction
            icon={<MenuBookIcon />}
            component={Link}
            href="/menus"
            className="text-secondary hover:text-gray"
          />
          <BottomNavigationAction
            icon={<HomeIcon />}
            component={Link}
            href="/"
            className="text-secondary hover:text-gray"
          />
          <BottomNavigationAction
            icon={<ListAltIcon />}
            component={Link}
            href="/history"
            className="text-secondary hover:text-gray"
          />
          <BottomNavigationAction
            icon={<PersonIcon />}
            component={Link}
            href="/profile"
            className="text-secondary hover:text-gray"
          />
        </BottomNavigation>
      </ThemeProvider>
    </Paper>
  );
}
