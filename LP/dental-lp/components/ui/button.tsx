"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary:
        "gradient-brand text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-turquoise-400",
      secondary:
        "bg-white text-royal-600 border-2 border-royal-200 hover:border-turquoise-400 hover:text-turquoise-600 focus:ring-turquoise-400",
      outline:
        "bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-white",
      ghost:
        "bg-transparent text-gray-600 hover:text-turquoise-600 hover:bg-turquoise-50 focus:ring-turquoise-400",
    };

    const sizes = {
      sm: "px-5 py-2 text-sm gap-1.5",
      md: "px-7 py-3 text-base gap-2",
      lg: "px-9 py-4 text-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
