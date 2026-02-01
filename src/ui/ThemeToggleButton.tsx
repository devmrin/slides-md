import { Button } from "./Button";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleButtonProps {
  isDark: boolean;
  setIsDark: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function ThemeToggleButton({
  isDark,
  setIsDark,
}: ThemeToggleButtonProps) {
  return (
    <Button
      onClick={() => setIsDark(!isDark)}
      className="px-3 py-1 text-xs sm:text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5"
    >
      {isDark ? (
        <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      ) : (
        <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      )}
      <span className="hidden sm:inline">
        {isDark ? "Dark (^T)" : "Light (^T)"}
      </span>
      <span className="sm:hidden">{isDark ? "Dark" : "Light"}</span>
    </Button>
  );
}
