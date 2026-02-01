import * as React from "react";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "../utils/cn";

export interface SwitchProps
    extends React.ComponentPropsWithoutRef<typeof Switch.Root> {
    className?: string;
}

const SwitchComponent = React.forwardRef<
    React.ElementRef<typeof Switch.Root>,
    SwitchProps
>(({ className, ...props }, ref) => {
    return (
        <Switch.Root
            ref={ref}
            className={cn(
                "w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative data-[state=checked]:bg-gray-500 dark:data-[state=checked]:bg-gray-500 outline-none cursor-pointer",
                "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-100",
                className
            )}
            {...props}
        >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
    );
});
SwitchComponent.displayName = "Switch";

export { SwitchComponent as Switch };

