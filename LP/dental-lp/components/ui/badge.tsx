import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "turquoise" | "sky" | "royal" | "white";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    turquoise: "bg-turquoise-50 text-turquoise-700 border border-turquoise-200",
    sky: "bg-sky-50 text-sky-700 border border-sky-200",
    royal: "bg-royal-50 text-royal-700 border border-royal-200",
    white: "bg-white/20 text-white border border-white/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
