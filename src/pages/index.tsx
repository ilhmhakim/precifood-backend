import { useEffect, useState } from "react";

import HomePage from "@/components/HomePage";
import LandingPage from "@/components/LandingPage";
import { getCookies } from "@/utils/cookie";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookies("token");
    setIsLoggedIn(!!token);
  }, []);

  return isLoggedIn ? <HomePage /> : <LandingPage />;
}
