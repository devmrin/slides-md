import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, ImagePlus, FileText, Presentation } from "lucide-react";
import { Button } from "../ui/Button";
import { ViewModeSelector } from "./ViewModeSelector";
import { type ViewMode } from "../hooks/useLocalStorage";

export type MobilePane = "editor" | "presentation";

interface StandardViewNavProps {
  presentationName?: string;
  onEditName?: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMediaLibrary?: () => void;
  isMobile?: boolean;
  mobilePane?: MobilePane;
  onMobilePaneChange?: (pane: MobilePane) => void;
}

export function StandardViewNav({
  presentationName,
  onEditName,
  viewMode,
  onViewModeChange,
  onOpenMediaLibrary,
  isMobile = false,
  mobilePane = "editor",
  onMobilePaneChange,
}: StandardViewNavProps) {
  const navigate = useNavigate();

  return (
    <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-2 flex-nowrap">
        <div className="flex items-center gap-2 flex-1 min-w-0 shrink">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="shrink-0 px-2 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center gap-1"
            title="Back to Home (^H)"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Home (^H)</span>
            <span className="sm:hidden">Home</span>
          </Button>
          {onOpenMediaLibrary && (
            <Button
              onClick={onOpenMediaLibrary}
              className="shrink-0 px-2 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center gap-1"
              title="Media Library (^M)"
            >
              <ImagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Media (^M)</span>
              <span className="sm:hidden">Media</span>
            </Button>
          )}
          {presentationName && (
            <>
              {onEditName ? (
                <button
                  onClick={onEditName}
                  className="flex items-center gap-1.5 min-w-0 px-1.5 py-0.5 rounded text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer truncate"
                  title="Edit presentation name"
                  type="button"
                >
                  <span className="truncate">{presentationName}</span>
                  <Pencil className="w-3 h-3 shrink-0" />
                </button>
              ) : (
                <span className="text-xs sm:text-sm truncate">
                  {presentationName}
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isMobile && onMobilePaneChange ? (
            <div
              className="flex rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 overflow-hidden"
              role="tablist"
              aria-label="Editor or Presentation view"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mobilePane === "editor"}
                onClick={() => onMobilePaneChange("editor")}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs touch-manipulation transition-colors ${
                  mobilePane === "editor"
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Editor
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobilePane === "presentation"}
                onClick={() => onMobilePaneChange("presentation")}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs touch-manipulation transition-colors border-l border-gray-400 dark:border-gray-600 ${
                  mobilePane === "presentation"
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                Presentation
              </button>
            </div>
          ) : (
            <ViewModeSelector
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
