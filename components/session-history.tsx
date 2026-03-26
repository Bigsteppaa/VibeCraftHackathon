"use client"

import { useState } from "react"
import { History, ChevronDown, Clock, CheckCircle2, Flame, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Session } from "@/app/page"

interface SessionHistoryProps {
  sessions: Session[]
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const recentSessions = sessions.slice(0, isExpanded ? 9 : 3)
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0)
  const totalTasks = sessions.reduce((acc, s) => acc + s.tasksCompleted.length, 0)

  if (sessions.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 glass-hover h-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-secondary">
            <History className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground">History</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
          <TrendingUp className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm">No sessions yet</p>
          <p className="text-xs opacity-70">Complete a focus session to see your history</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-4 glass-hover h-full">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-lg transition-colors",
            sessions.length > 0 ? "bg-primary/20" : "bg-secondary"
          )}>
            <History className={cn("h-4 w-4", sessions.length > 0 ? "text-primary" : "text-muted-foreground")} />
          </div>
          <h3 className="text-base font-semibold text-foreground">History</h3>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-secondary/80">
            {sessions.length}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-300",
          isExpanded && "rotate-180"
        )} />
      </button>

      {/* Quick Stats */}
      <div className="flex gap-3 mb-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{totalMinutes}</span> min total
          </span>
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40">
          <Flame className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{totalTasks}</span> tasks done
          </span>
        </div>
      </div>

      {/* Sessions List */}
      <div className={cn(
        "space-y-2 overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[400px] overflow-y-auto" : "max-h-[180px]"
      )}>
        {recentSessions.map((session, index) => (
          <div
            key={session.id}
            className={cn(
              "p-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-all duration-200",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{session.duration}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {session.duration} min focus
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDate(session.timestamp)}
                  </p>
                </div>
              </div>
              
              {session.tasksCompleted.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">
                    {session.tasksCompleted.length}
                  </span>
                </div>
              )}
            </div>
            
            {session.tasksCompleted.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {session.tasksCompleted.slice(0, 2).map((task, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground truncate max-w-[100px]"
                    title={task}
                  >
                    {task}
                  </span>
                ))}
                {session.tasksCompleted.length > 2 && (
                  <span className="text-[10px] text-muted-foreground/70">
                    +{session.tasksCompleted.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {sessions.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          {isExpanded ? "Show less" : `View ${sessions.length - 3} more`}
        </button>
      )}
    </div>
  )
}
