import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { router } from "./router";

export default function App() {
  const [isDark] = useLocalStorage("theme", false);
  const isDarkValue = isDark ?? false;

  // Apply dark class to root element for Tailwind dark mode
  useEffect(() => {
    if (isDarkValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkValue]);

  return <RouterProvider router={router} />;
}
