import { ThemeToggleButton } from "../ui/ThemeToggleButton";
import { GettingStartedModal } from "./GettingStartedModal";

interface AppHeaderProps {
  isDark: boolean;
  setIsDark: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function AppHeader({ isDark, setIsDark }: AppHeaderProps) {
  return (
    <header className="border-b px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
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

