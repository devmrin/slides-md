import * as Toast from "@radix-ui/react-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import { type ReactNode } from "react";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-[100] outline-none" />
    </Toast.Provider>
  );
}

interface ToastRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "success" | "error";
}

export function ToastRoot({
  open,
  onOpenChange,
  title,
  description,
  variant = "success",
}: ToastRootProps) {
  const isError = variant === "error";

  return (
    <Toast.Root
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 grid grid-cols-[auto_1fr_auto] gap-3 items-start data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-right-full data-[swipe=end]:slide-out-to-right-full"
      open={open}
      onOpenChange={onOpenChange}
      duration={3000}
    >
      {isError ? (
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5" />
      )}
      <div className="flex flex-col gap-1">
        <Toast.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </Toast.Title>
        {description && (
          <Toast.Description className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </Toast.Description>
        )}
      </div>
      <Toast.Close className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
        <span className="sr-only">Close</span>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Toast.Close>
    </Toast.Root>
  );
}
