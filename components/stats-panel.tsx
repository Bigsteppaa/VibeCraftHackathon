"use client"

import { useMemo } from "react"
import { TrendingUp, Clock, Flame, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Session } from "@/app/page"

interface StatsPanelProps {
  sessions: Session[]
  timerRunning: boolean
  musicPlaying: boolean
}

export function StatsPanel({ sessions, timerRunning, musicPlaying }: StatsPanelProps) {
  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todaySessions = sessions.filter(
      s => new Date(s.timestamp).toDateString() === today
    )
    
    const totalMinutesToday = todaySessions.reduce((acc, s) => acc + s.duration, 0)
    const totalTasksToday = todaySessions.reduce((acc, s) => acc + s.tasksCompleted.length, 0)
    
    // Calculate streak (consecutive days with sessions)
    let streak = 0
    const sortedDates = [...new Set(sessions.map(s => 
      new Date(s.timestamp).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    
    if (sortedDates.length > 0) {
      const checkDate = new Date()
      for (const dateStr of sortedDates) {
        const sessionDate = new Date(dateStr)
        const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays <= streak + 1) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    return {
      sessionsToday: todaySessions.length,
      minutesToday: totalMinutesToday,
      tasksToday: totalTasksToday,
      streak: streak
    }
  }, [sessions])

  const statItems = [
    {
      icon: Clock,
      label: "Focus Time",
      value: `${stats.minutesToday}m`,
      color: "text-primary",
      bgColor: "bg-primary/10",
      active: timerRunning
    },
    {
      icon: Target,
      label: "Sessions",
      value: stats.sessionsToday.toString(),
      color: "text-accent",
      bgColor: "bg-accent/10",
      active: false
    },
    {
      icon: TrendingUp,
      label: "Tasks Done",
      value: stats.tasksToday.toString(),
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      active: false
    },
    {
      icon: Flame,
      label: "Streak",
      value: `${stats.streak}d`,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      active: stats.streak >= 3
    }
  ]

  return (
    <div className="glass rounded-2xl p-4 glass-hover h-full">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Today&apos;s Progress
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "relative rounded-xl p-3 transition-all duration-300",
              stat.bgColor,
              stat.active && "ring-1 ring-current"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {stat.active && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", stat.color.replace("text-", "bg-"))} />
                <span className={cn("relative inline-flex rounded-full h-2 w-2", stat.color.replace("text-", "bg-"))} />
              </span>
            )}
            <stat.icon className={cn("h-4 w-4 mb-1", stat.color)} />
            <p className="text-lg font-bold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
