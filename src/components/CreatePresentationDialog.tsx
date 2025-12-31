import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { MAX_PRESENTATIONS } from "../config/constants";

interface CreatePresentationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
  currentCount: number;
}

export function CreatePresentationDialog({
  open,
  onOpenChange,
  onCreate,
  currentCount,
}: CreatePresentationDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Presentation name is required");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Presentation name must be 100 characters or less");
      return;
    }

    if (currentCount >= MAX_PRESENTATIONS) {
      setError(`Maximum of ${MAX_PRESENTATIONS} presentations allowed`);
      return;
    }

    onCreate(trimmedName);
    setName("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md z-50 border border-gray-300 dark:border-gray-700">
          <div className="p-6 relative">
            <Dialog.Close asChild>
              <Button
                className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation"
                aria-label="Close"
                type="button"
              >
                <X className="w-5 h-5" />
              </Button>
            </Dialog.Close>
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 pr-12">
              Create New Presentation
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Enter a name for your new presentation
            </Dialog.Description>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="presentation-name"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
                >
                  Presentation Name
                </label>
                <input
                  id="presentation-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Enter presentation name"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button type="button" btnType="secondary">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button type="submit" btnType="primary">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

