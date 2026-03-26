"use client"

import { useState } from "react"
import { Keyboard, X, Command } from "lucide-react"
import { cn } from "@/lib/utils"

const shortcuts = [
  { key: "Space", action: "Play/pause music", icon: "play" },
  { key: "S", action: "Start/pause timer", icon: "timer" },
  { key: "N", action: "New task", icon: "plus" },
  { key: "C", action: "Clear completed", icon: "check" },
  { key: "F", action: "Toggle focus mode", icon: "focus" },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300",
          "glass glass-hover",
          isOpen && "ring-2 ring-primary/50"
        )}
      >
        <Keyboard className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground hidden sm:inline">Keys</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-72 glass rounded-2xl p-4 animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/20">
                  <Command className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={shortcut.key}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl",
                    "bg-secondary/40 hover:bg-secondary/70 transition-all",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-sm text-foreground">{shortcut.action}</span>
                  <kbd className={cn(
                    "inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-lg",
                    "bg-background/50 border border-border/50",
                    "text-foreground font-mono text-xs font-medium",
                    "shadow-sm"
                  )}>
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[10px] text-muted-foreground/70 text-center">
              Shortcuts work when not typing in inputs
            </p>
          </div>
        </>
      )}
    </div>
  )
}
