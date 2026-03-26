"use client"

import { useState } from "react"
import { History, ChevronDown, ChevronUp, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Session } from "@/app/page"

interface SessionHistoryProps {
  sessions: Session[]
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const recentSessions = sessions.slice(0, isExpanded ? 10 : 3)

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Session History</h2>
          <span className="text-sm text-muted-foreground">
            ({sessions.length} total)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "grid gap-3 transition-all duration-300",
          isExpanded ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-3"
        )}
      >
        {recentSessions.map((session, index) => (
          <div
            key={session.id}
            className={cn(
              "p-4 rounded-xl bg-secondary/50 transition-all",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDate(session.timestamp)}</span>
              </div>
              <span className="text-sm font-medium text-primary">
                {session.duration} min
              </span>
            </div>
            {session.tasksCompleted.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Tasks completed:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {session.tasksCompleted.slice(0, 3).map((task, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary truncate max-w-[120px]"
                      title={task}
                    >
                      {task}
                    </span>
                  ))}
                  {session.tasksCompleted.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{session.tasksCompleted.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sessions.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? "Show less" : `Show ${sessions.length - 3} more sessions`}
        </button>
      )}
    </div>
  )
}
