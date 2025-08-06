"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => {
    const base =
    "px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:pointer-events-none disabled:opacity-100";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline:
        "bg-white text-slate-800 border border-slate-300 hover:bg-blue-50 hover:border-blue-400",
      ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
    };

    const sizes = {
      default: "",
      icon: "h-8 w-8 p-0 flex items-center justify-center",
    };

    const disabledStyles = disabled
  ? "pointer-events-none cursor-not-allowed"
  : "cursor-pointer";


    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], disabledStyles, className)}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
