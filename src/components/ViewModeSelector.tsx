import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Layout } from "lucide-react";
import { type ViewMode } from "../hooks/useLocalStorage";

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

interface ViewModeIconProps {
  mode: ViewMode;
  isActive?: boolean;
  size?: "sm" | "md";
}

/**
 * Visual block icon representing each view mode.
 * Uses div blocks to show editor (darker) and preview (lighter) proportions.
 */
function ViewModeIcon({ mode, isActive, size = "sm" }: ViewModeIconProps) {
  const baseClasses = size === "sm" ? "h-4 w-6" : "h-5 w-8";
  const blockClasses = "rounded-[2px]";
  const editorColor = isActive ? "bg-blue-500" : "bg-gray-600 dark:bg-gray-300";
  const previewColor = isActive
    ? "bg-blue-300"
    : "bg-gray-400 dark:bg-gray-500";
  const gap = size === "sm" ? "gap-[2px]" : "gap-1";

  switch (mode) {
    case "full-editor":
      return (
        <div className={`${baseClasses} flex ${gap}`}>
          <div className={`flex-1 ${blockClasses} ${editorColor}`} />
        </div>
      );
    case "full-preview":
      return (
        <div className={`${baseClasses} flex ${gap}`}>
          <div className={`flex-1 ${blockClasses} ${previewColor}`} />
        </div>
      );
    case "split":
      return (
        <div className={`${baseClasses} flex ${gap}`}>
          <div className={`flex-1 ${blockClasses} ${editorColor}`} />
          <div className={`flex-1 ${blockClasses} ${previewColor}`} />
        </div>
      );
    case "editor-35":
      return (
        <div className={`${baseClasses} flex ${gap}`}>
          <div className={`w-[35%] ${blockClasses} ${editorColor}`} />
          <div className={`flex-1 ${blockClasses} ${previewColor}`} />
        </div>
      );
    case "editor-65":
      return (
        <div className={`${baseClasses} flex ${gap}`}>
          <div className={`w-[65%] ${blockClasses} ${editorColor}`} />
          <div className={`flex-1 ${blockClasses} ${previewColor}`} />
        </div>
      );
  }
}

const VIEW_MODES: ViewMode[] = [
  "full-editor",
  "editor-65",
  "split",
  "editor-35",
  "full-preview",
];

const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  "full-editor": "Full Editor",
  "full-preview": "Full Preview",
  split: "Split 50/50",
  "editor-35": "Preview 65%",
  "editor-65": "Editor 65%",
};

export function ViewModeSelector({
  viewMode,
  onViewModeChange,
}: ViewModeSelectorProps) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation cursor-pointer"
            title="Change View"
          >
            <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Change View
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[160px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-2 z-50"
            sideOffset={5}
            align="end"
          >
            <div className="flex items-center justify-center gap-1 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
              {VIEW_MODES.map((mode) => (
                <Tooltip.Root key={mode} delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Item
                      className={`p-1.5 rounded cursor-pointer outline-none transition-colors ${viewMode === mode
                          ? "bg-blue-100 dark:bg-blue-900/50"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      onSelect={() => onViewModeChange(mode)}
                    >
                      <ViewModeIcon
                        mode={mode}
                        isActive={viewMode === mode}
                        size="md"
                      />
                    </DropdownMenu.Item>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="px-2 py-1 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded shadow-lg z-[100]"
                      sideOffset={5}
                    >
                      {VIEW_MODE_LABELS[mode]}
                      <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </Tooltip.Provider>
  );
}
