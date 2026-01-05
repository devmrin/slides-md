import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { MediaItem } from "../db/adapter";

interface EditAltDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaItem;
  onSave: (id: string, alt: string) => Promise<void>;
}

export function EditAltDialog({
  open,
  onOpenChange,
  media,
  onSave,
}: EditAltDialogProps) {
  const [alt, setAlt] = useState(media.alt || "");
  const [isSaving, setIsSaving] = useState(false);

  // Reset alt when media changes
  useEffect(() => {
    setAlt(media.alt || "");
  }, [media]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(media.id, alt);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save alt text:", error);
      alert("Failed to save alt text");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[55]" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md z-[60] border border-gray-300 dark:border-gray-700"
          onEscapeKeyDown={(e) => {
            if (!isSaving) {
              onOpenChange(false);
            } else {
              e.preventDefault();
            }
          }}
        >
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Edit Alt Text
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add alternative text for accessibility
                </Dialog.Description>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Image preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <img
                  src={media.dataUrl}
                  alt={media.filename}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {media.filename}
                  </p>
                </div>
              </div>

              {/* Alt text input */}
              <div>
                <label
                  htmlFor="alt-text"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Alternative Text
                </label>
                <textarea
                  id="alt-text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the image for screen readers..."
                  rows={3}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Press ⌘/Ctrl+Enter to save
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors touch-manipulation disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
