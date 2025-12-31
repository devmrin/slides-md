import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "../ui/Button";
import { Switch } from "../ui/Switch";

interface StandardViewNavProps {
  presentationName?: string;
  onEditName?: () => void;
  isEditorExpanded: boolean;
  onToggleEditorExpand: () => void;
}

export function StandardViewNav({
  presentationName,
  onEditName,
  isEditorExpanded,
  onToggleEditorExpand,
}: StandardViewNavProps) {
  const navigate = useNavigate();

  return (
    <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="px-2 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center gap-1"
            title="Back to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Home
          </Button>
          {presentationName && (
            <>
              {onEditName ? (
                <button
                  onClick={onEditName}
                  className="flex items-center gap-1.5 min-w-0 px-1.5 py-0.5 rounded text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  title="Edit presentation name"
                  type="button"
                >
                  <span className="truncate">{presentationName}</span>
                  <Pencil className="w-3 h-3 shrink-0" />
                </button>
              ) : (
                <span className="text-xs sm:text-sm truncate">{presentationName}</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 dark:text-gray-400" htmlFor="editor-toggle">
            Show Editor
          </label>
          <Switch
            id="editor-toggle"
            checked={isEditorExpanded}
            onCheckedChange={onToggleEditorExpand}
          />
        </div>
      </div>
    </div>
  );
}

