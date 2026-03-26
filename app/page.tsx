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
import { StatsPanel } from "@/components/stats-panel"
import { Sparkles, Zap, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export type Theme = "rain" | "night-city" | "aurora" | "sunset"

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
  const [focusMode, setFocusMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const musicRef = useRef<{ toggle: () => void; isPlaying: boolean } | null>(null)
  const timerRef = useRef<{ toggleTimer: () => void; isRunning: boolean } | null>(null)
  const taskRef = useRef<{ clearCompleted: () => void; focusInput: () => void } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

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
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault()
          musicRef.current?.toggle()
          break
        case "s":
          e.preventDefault()
          timerRef.current?.toggleTimer()
          break
        case "n":
          e.preventDefault()
          taskRef.current?.focusInput()
          break
        case "c":
          e.preventDefault()
          taskRef.current?.clearCompleted()
          break
        case "f":
          e.preventDefault()
          setFocusMode(prev => !prev)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (!mounted) return null

  return (
    <main className="relative min-h-screen overflow-hidden theme-transition">
      {/* Ambient Background */}
      <AmbientBackground theme={theme} />

      {/* Main Content */}
      <div className={cn(
        "relative z-10 min-h-screen transition-all duration-500",
        focusMode ? "p-2 md:p-4" : "p-4 md:p-6 lg:p-8"
      )}>
        {/* Top Bar */}
        <header className={cn(
          "mb-6 flex items-center justify-between transition-all duration-500",
          focusMode && "opacity-0 pointer-events-none h-0 mb-0"
        )}>
          <div className="flex items-center gap-4 animate-fade-in-up">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative glass rounded-2xl p-3 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50" />
                  <div className="relative bg-gradient-to-br from-primary to-accent/80 rounded-xl p-2">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Flowstate
                  </h1>
                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Focus Sanctuary</p>
                </div>
              </div>
            </div>

            {/* Time & Greeting */}
            <div className="hidden md:flex flex-col items-start animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-3xl font-mono font-bold text-foreground tabular-nums tracking-tight">
                {formatTime(currentTime)}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                {currentTime.getHours() >= 18 || currentTime.getHours() < 6 ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : (
                  <Sun className="h-3.5 w-3.5" />
                )}
                {getGreeting()}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Focus Mode Toggle */}
            <button
              onClick={() => setFocusMode(prev => !prev)}
              className={cn(
                "hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                "glass glass-hover text-sm font-medium",
                focusMode && "bg-primary text-primary-foreground"
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>Focus</span>
            </button>
            <KeyboardShortcuts />
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </header>

        {/* Quote Display - Hidden in focus mode */}
        <div className={cn(
          "mb-6 transition-all duration-500",
          focusMode && "opacity-0 pointer-events-none h-0 mb-0 overflow-hidden"
        )}>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <QuoteDisplay />
          </div>
        </div>

        {/* Main Grid - Responsive Bento Layout */}
        <div className={cn(
          "grid gap-4 md:gap-6 transition-all duration-500",
          focusMode 
            ? "grid-cols-1 max-w-2xl mx-auto" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-12"
        )}>
          {/* Timer - Center of attention */}
          <div
            className={cn(
              "animate-fade-in-up",
              focusMode ? "order-1" : "lg:col-span-5 lg:row-span-2"
            )}
            style={{ animationDelay: "0.2s" }}
          >
            <PomodoroTimer
              ref={timerRef}
              onSessionComplete={handleSessionComplete}
              onRunningChange={setTimerRunning}
              focusMode={focusMode}
            />
          </div>

          {/* Music Player */}
          <div
            className={cn(
              "animate-fade-in-up transition-all duration-500",
              focusMode ? "order-3" : "lg:col-span-4"
            )}
            style={{ animationDelay: "0.3s" }}
          >
            <MusicPlayer
              ref={musicRef}
              theme={theme}
              onPlayingChange={setMusicPlaying}
              compact={focusMode}
            />
          </div>

          {/* Stats Panel - Quick glance metrics */}
          <div
            className={cn(
              "animate-fade-in-up transition-all duration-500",
              focusMode && "hidden"
            )}
            style={{ animationDelay: "0.35s" }}
          >
            <div className="lg:col-span-3">
              <StatsPanel sessions={sessions} timerRunning={timerRunning} musicPlaying={musicPlaying} />
            </div>
          </div>

          {/* Task Panel */}
          <div
            className={cn(
              "animate-fade-in-up transition-all duration-500",
              focusMode ? "order-2" : "lg:col-span-4"
            )}
            style={{ animationDelay: "0.4s" }}
          >
            <TaskPanel ref={taskRef} onTaskComplete={handleTaskComplete} compact={focusMode} />
          </div>

          {/* Session History */}
          <div className={cn(
            "animate-fade-in-up transition-all duration-500",
            focusMode && "hidden"
          )} style={{ animationDelay: "0.45s" }}>
            <div className="lg:col-span-3">
              <SessionHistory sessions={sessions} />
            </div>
          </div>
        </div>

        {/* Floating Status Indicator */}
        <div className={cn(
          "fixed bottom-20 left-1/2 -translate-x-1/2 transition-all duration-500 z-40",
          (timerRunning || musicPlaying) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          <div className="glass rounded-full px-4 py-2 flex items-center gap-3">
            {timerRunning && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs text-foreground font-medium">Focus Active</span>
              </div>
            )}
            {timerRunning && musicPlaying && <span className="text-muted-foreground/50">|</span>}
            {musicPlaying && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="eq-bar w-0.5 bg-accent rounded-full"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-foreground font-medium">Music On</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
