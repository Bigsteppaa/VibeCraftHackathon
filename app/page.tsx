"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MusicPlayer } from "@/components/music-player"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TaskPanel } from "@/components/task-panel"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { QuoteDisplay } from "@/components/quote-display"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { SessionHistory } from "@/components/session-history"
import { AmbientBackground } from "@/components/ambient-background"
import { Sparkles, Coffee } from "lucide-react"

export type Theme = "rain" | "night-city"

export interface Session {
  id: string
  timestamp: Date
  duration: number
  tasksCompleted: string[]
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("night-city")
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const taskInputRef = useRef<HTMLInputElement>(null)
  const musicRef = useRef<{ toggle: () => void; isPlaying: boolean } | null>(null)
  const timerRef = useRef<{ toggleTimer: () => void; isRunning: boolean } | null>(null)
  const taskRef = useRef<{ clearCompleted: () => void; focusInput: () => void } | null>(null)

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro-sessions")
    if (saved) {
      setSessions(JSON.parse(saved))
    }
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("pomodoro-sessions", JSON.stringify(sessions))
  }, [sessions])

  const handleSessionComplete = useCallback((duration: number) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      duration,
      tasksCompleted: completedTasks,
    }
    setSessions((prev) => [newSession, ...prev])
    setCompletedTasks([])
  }, [completedTasks])

  const handleTaskComplete = useCallback((taskName: string) => {
    setCompletedTasks((prev) => [...prev, taskName])
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case " ": // Spacebar - play/pause music
          e.preventDefault()
          musicRef.current?.toggle()
          break
        case "s": // S - start/pause timer
          e.preventDefault()
          timerRef.current?.toggleTimer()
          break
        case "n": // N - focus task input
          e.preventDefault()
          taskRef.current?.focusInput()
          break
        case "c": // C - clear completed tasks
          e.preventDefault()
          taskRef.current?.clearCompleted()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden theme-transition">
      {/* Ambient Background */}
      <AmbientBackground theme={theme} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Coffee className="h-8 w-8 text-primary animate-float" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Flowstate
              </h1>
              <p className="text-xs text-muted-foreground">Your focus sanctuary</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <KeyboardShortcuts />
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </header>

        {/* Quote Display */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <QuoteDisplay />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Music Player */}
          <div
            className="animate-fade-in-up lg:col-span-1"
            style={{ animationDelay: "0.2s" }}
          >
            <MusicPlayer
              ref={musicRef}
              theme={theme}
              onPlayingChange={setMusicPlaying}
            />
          </div>

          {/* Pomodoro Timer */}
          <div
            className="animate-fade-in-up lg:col-span-1"
            style={{ animationDelay: "0.3s" }}
          >
            <PomodoroTimer
              ref={timerRef}
              onSessionComplete={handleSessionComplete}
              onRunningChange={setTimerRunning}
            />
          </div>

          {/* Task Panel */}
          <div
            className="animate-fade-in-up md:col-span-2 lg:col-span-1"
            style={{ animationDelay: "0.4s" }}
          >
            <TaskPanel ref={taskRef} onTaskComplete={handleTaskComplete} />
          </div>
        </div>

        {/* Session History */}
        <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <SessionHistory sessions={sessions} />
        </div>
      </div>
    </main>
  )
}
