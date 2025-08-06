"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot";


// Main Sidebar container
export const Sidebar = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <aside className={cn("w-80 h-screen flex flex-col bg-muted p-4", className)} {...props} />
)


// Inner content of Sidebar
export const SidebarContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex-1 overflow-y-auto max-h-screen space-y-4 p-[10px] rounded-[10px]",
      className
    )}
    {...props}
  />
)


// Header section
export const SidebarHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("font-semibold text-lg px-2", className)} {...props} />
)

// Group wrapper
export const SidebarGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2", className)} {...props} />
)

// Label for a group
// export const SidebarGroupLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
//   <h4 className={cn("text-sm text-muted-foreground px-2", className)} {...props} />
// )

// Content within group
export const SidebarGroupContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-1", className)} {...props} />
)

// Menu container
export const SidebarMenu = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2", className)} {...props} />
)

// Each menu item
export const SidebarMenuItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center space-x-2 p-2 hover:bg-accent rounded", className)} {...props} />
)

// The actual button
// export const SidebarMenuButton = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
//   <button
//     onClick={onClick}
//     className="flex items-center space-x-2 w-full text-left hover:text-primary"
//   >
//     {children}
//   </button>
// )

export const SidebarMenuButton = ({
  onClick,
  children,
  className,
  isActive,
  ...props
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    data-active={isActive}
    className={cn(
      "flex items-center space-x-2 w-full text-left hover:text-primary",
      className
    )}
    {...props}
  >
    {children}
  </button>
);


// Small inset like rail or divider area
export const SidebarInset = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border-t pt-2 mt-2", className)} {...props} />
)

// Optional sidebar rail (for compact mode)
export const SidebarRail = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-16 bg-muted p-2", className)} {...props} />
)

// Trigger to collapse/expand
// export const SidebarTrigger = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
//   <button
//     onClick={onClick}
//     className="text-xs text-muted-foreground hover:text-primary"
//   >
//     {children}
//   </button>
// )

export const SidebarTrigger = ({
  onClick,
  children,
  className,
  ...props
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    className={cn("text-xs text-muted-foreground hover:text-primary", className)}
    {...props}
  >
    {children}
  </button>
);



export const SidebarGroupLabel = ({
  className,
  asChild,
  children,
  ...props
}: {
  className?: string;
  asChild?: boolean;
  children: React.ReactNode;
}) => {
  const Comp = asChild ? Slot : "h4";
  return (
    <Comp className={cn("text-sm text-muted-foreground px-2", className)} {...props}>
      {children}
    </Comp>
  );
};

