import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

// Simplified Button without Radix for now
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const variantStyles = {
  default: "bg-[#3DDC84] text-white hover:bg-[#2BB667] shadow-sm",
  outline: "border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
  ghost: "hover:bg-black/5 dark:hover:bg-white/5",
  secondary: "bg-black/5 dark:bg-white/5 text-foreground hover:bg-black/10 dark:hover:bg-white/10",
};

const sizeStyles = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
