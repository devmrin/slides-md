import { useEffect } from "react";
import { ThemeToggleButton } from "../ui/ThemeToggleButton";
import { GettingStartedModal } from "./GettingStartedModal";

interface AppHeaderProps {
  isDark: boolean;
  setIsDark: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function AppHeader({ isDark, setIsDark }: AppHeaderProps) {
  // Global keyboard shortcut: Command/Control+T to toggle theme
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Command+T or Control+T to toggle theme (prevent browser default)
      if ((e.metaKey || e.ctrlKey) && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        setIsDark((d) => !d);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setIsDark]);

  return (
    <header className="border-b px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          ✱ slides.md
          <GettingStartedModal />
        </h1>

        <div className="flex flex-col items-end gap-2 min-[1200px]:flex-row min-[1200px]:items-center">
          <ThemeToggleButton isDark={isDark} setIsDark={setIsDark} />
        </div>
      </div>
    </header>
  );
}

