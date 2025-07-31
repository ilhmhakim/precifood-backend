import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";

import { ThemeProvider, createTheme } from "@mui/material";

import "@/styles/globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

//Diubah
const theme = createTheme({
  palette: {
    primary: {
      main: "#D4CAA3",
    },
    secondary: {
      main: "#9EB384",
    },
    error: {
      main: "#982B1C",
    },
    warning: {
      main: "#FC8F54",
    },
    info: {
      main: "#405D72",
    },
    success: {
      main: "#6A9C89",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={roboto.className}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  );
}
