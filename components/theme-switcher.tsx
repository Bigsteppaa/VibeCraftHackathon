"use client"

import { CloudRain, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/app/page"

interface ThemeSwitcherProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
}

const themes = [
  {
    id: "rain" as Theme,
    name: "Rainy Day",
    icon: CloudRain,
    description: "Calm rain ambiance",
  },
  {
    id: "night-city" as Theme,
    name: "Night City",
    icon: Building2,
    description: "Urban nightscape vibes",
  },
]

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/50">
      {themes.map((theme) => {
        const Icon = theme.icon
        const isActive = currentTheme === theme.id
        
        return (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            title={theme.description}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{theme.name}</span>
          </button>
        )
      })}
    </div>
  )
}
