"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center space-x-2 p-2 hover:bg-accent rounded", className)} {...props} />
}

export function SidebarMenuButton({ onClick, children }: { onClick?: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 w-full text-left hover:text-primary"
    >
      {children}
    </button>
  )
}
