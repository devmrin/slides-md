import * as React from "react";
import * as Slot from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  btnType?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "px-3 py-1 border rounded border-gray-800 dark:border-gray-700 text-white bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700",
  secondary:
    "px-3 py-1 border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800",
  danger:
    "px-3 py-1 border rounded border-red-400 dark:border-red-600 text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, btnType = "secondary", ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        className={cn(
          "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-100 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[btnType],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

