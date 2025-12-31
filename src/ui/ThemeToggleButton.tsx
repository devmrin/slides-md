import { Button } from "./Button";

interface ThemeToggleButtonProps {
  isDark: boolean;
  setIsDark: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function ThemeToggleButton({ isDark, setIsDark }: ThemeToggleButtonProps) {
  return (
    <Button
      onClick={() => setIsDark(!isDark)}
      className="px-3 py-1 text-xs sm:text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <span className="hidden sm:inline">{isDark ? "Light (^T)" : "Dark (^T)"}</span>
      <span className="sm:hidden">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}

