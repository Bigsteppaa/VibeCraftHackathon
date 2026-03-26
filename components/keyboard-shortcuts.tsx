"use client"

import { useState } from "react"
import { Keyboard, X } from "lucide-react"
import { cn } from "@/lib/utils"

const shortcuts = [
  { key: "Space", action: "Play/pause music" },
  { key: "S", action: "Start/pause timer" },
  { key: "N", action: "Focus task input" },
  { key: "C", action: "Clear completed tasks" },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all",
          isOpen
            ? "bg-primary text-primary-foreground"
            : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
        )}
      >
        <Keyboard className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:inline">Shortcuts</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-64 glass rounded-xl p-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{shortcut.action}</span>
                  <kbd className="px-2 py-1 rounded bg-secondary text-foreground font-mono text-xs">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
