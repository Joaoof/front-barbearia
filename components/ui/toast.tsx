"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Toast({ open, onOpenChange, children, className }: ToastProps) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 8000) // Aumentei para 8 segundos
      return () => clearTimeout(timer)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      <div
        className={cn(
          "bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-w-md w-full pointer-events-auto animate-in slide-in-from-bottom duration-500",
          className,
        )}
      >
        <div className="flex items-start justify-between p-4">
          <div className="flex-1">{children}</div>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white ml-4 flex-shrink-0 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
