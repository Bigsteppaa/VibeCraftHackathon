"use client"

import { useState } from "react"
import { CloudRain, Building2, Sparkles, Sunset, Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/app/page"

interface ThemeSwitcherProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
}

const themes = [
  {
    id: "night-city" as Theme,
    name: "Night City",
    description: "Urban skyline vibes",
    icon: Building2,
    colors: ["#6366f1", "#1e1b4b", "#312e81"],
  },
  {
    id: "rain" as Theme,
    name: "Rainy Day",
    description: "Cozy rain sounds",
    icon: CloudRain,
    colors: ["#64748b", "#1e293b", "#334155"],
  },
  {
    id: "aurora" as Theme,
    name: "Aurora",
    description: "Northern lights",
    icon: Sparkles,
    colors: ["#10b981", "#6366f1", "#0f172a"],
  },
  {
    id: "sunset" as Theme,
    name: "Sunset",
    description: "Ocean horizon",
    icon: Sunset,
    colors: ["#f97316", "#be185d", "#1e293b"],
  },
]

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
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
        <Palette className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground hidden sm:inline">Theme</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl p-2 z-50 animate-fade-in-up shadow-2xl">
            <div className="p-2 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ambient Theme
              </h3>
            </div>
            
            <div className="space-y-1">
              {themes.map((theme) => {
                const Icon = theme.icon
                const isActive = currentTheme === theme.id
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/15 ring-1 ring-primary/30"
                        : "hover:bg-secondary/80"
                    )}
                  >
                    {/* Color preview */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-lg overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 50%, ${theme.colors[2]} 100%)`
                        }}
                      />
                      {isActive && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-medium",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {theme.name}
                        </span>
                        <Icon className={cn(
                          "h-3.5 w-3.5",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {theme.description}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
