import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  presentationName: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  presentationName,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
              Delete Presentation
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Confirm deletion of the presentation. This action cannot be undone.
            </Dialog.Description>

            <div className="mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete <span className="font-semibold">"{presentationName}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" btnType="secondary">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="button" onClick={handleConfirm} btnType="danger">
                Delete
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

