import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const variantStyles = {
  default: "border-transparent bg-[#3DDC84] text-white hover:bg-[#2BB667]",
  secondary: "border-transparent bg-black/10 dark:bg-white/10 text-foreground hover:bg-black/20 dark:hover:bg-white/20",
  outline: "text-foreground border border-black/20 dark:border-white/20",
  destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles[variant]} ${className || ""}`}
      {...props}
    />
  );
}
