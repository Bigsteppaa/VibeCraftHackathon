"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react"
import { Play, Pause, RotateCcw, Clock, Settings, Plus, Check, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerPreset {
  id: string
  name: string
  duration: number
  color: string
}

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: "1", name: "Focus", duration: 25, color: "primary" },
  { id: "2", name: "Short Break", duration: 5, color: "accent" },
  { id: "3", name: "Long Break", duration: 15, color: "chart-3" },
]

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number) => void
  onRunningChange?: (running: boolean) => void
  focusMode?: boolean
}

export interface PomodoroTimerRef {
  toggleTimer: () => void
  isRunning: boolean
}

export const PomodoroTimer = forwardRef<PomodoroTimerRef, PomodoroTimerProps>(
  ({ onSessionComplete, onRunningChange, focusMode = false }, ref) => {
    const [presets, setPresets] = useState<TimerPreset[]>([])
    const [activePreset, setActivePreset] = useState<TimerPreset>(DEFAULT_PRESETS[0])
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [sessionsCompleted, setSessionsCompleted] = useState(0)
    const [showSettings, setShowSettings] = useState(false)
    const [showPresetDropdown, setShowPresetDropdown] = useState(false)
    const [newPresetName, setNewPresetName] = useState("")
    const [newPresetDuration, setNewPresetDuration] = useState(25)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const initialDuration = useRef(25 * 60)

    // Load presets from localStorage
    useEffect(() => {
      const saved = localStorage.getItem("timer-presets")
      if (saved) {
        setPresets(JSON.parse(saved))
      }
      const savedSessions = localStorage.getItem("sessions-today")
      if (savedSessions) {
        const data = JSON.parse(savedSessions)
        const today = new Date().toDateString()
        if (data.date === today) {
          setSessionsCompleted(data.count)
        }
      }
    }, [])

    useEffect(() => {
      localStorage.setItem("timer-presets", JSON.stringify(presets))
    }, [presets])

    useEffect(() => {
      localStorage.setItem(
        "sessions-today",
        JSON.stringify({ date: new Date().toDateString(), count: sessionsCompleted })
      )
    }, [sessionsCompleted])

    useImperativeHandle(ref, () => ({
      toggleTimer: () => toggleTimer(),
      isRunning,
    }))

    const toggleTimer = useCallback(() => {
      setIsRunning((prev) => {
        const newState = !prev
        onRunningChange?.(newState)
        return newState
      })
    }, [onRunningChange])

    const resetTimer = () => {
      setIsRunning(false)
      setTimeLeft(activePreset.duration * 60)
      initialDuration.current = activePreset.duration * 60
      onRunningChange?.(false)
    }

    const selectPreset = (preset: TimerPreset) => {
      setActivePreset(preset)
      setTimeLeft(preset.duration * 60)
      initialDuration.current = preset.duration * 60
      setIsRunning(false)
      setShowPresetDropdown(false)
      onRunningChange?.(false)
    }

    const addPreset = () => {
      if (newPresetName.trim() && newPresetDuration > 0) {
        const colors = ["primary", "accent", "chart-3", "chart-4", "chart-5"]
        const newPreset: TimerPreset = {
          id: crypto.randomUUID(),
          name: newPresetName.trim(),
          duration: newPresetDuration,
          color: colors[Math.floor(Math.random() * colors.length)],
        }
        setPresets((prev) => [...prev, newPreset])
        setNewPresetName("")
        setNewPresetDuration(25)
      }
    }

    const deletePreset = (id: string) => {
      setPresets((prev) => prev.filter((p) => p.id !== id))
    }

    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => prev - 1)
        }, 1000)
      } else if (timeLeft === 0 && isRunning) {
        setIsRunning(false)
        onRunningChange?.(false)
        setSessionsCompleted((prev) => prev + 1)
        onSessionComplete?.(activePreset.duration)
        
        try {
          audioRef.current = new Audio("/timer-complete.mp3")
          audioRef.current.play().catch(() => {
            const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            oscillator.frequency.value = 800
            oscillator.type = "sine"
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
          })
        } catch {
          // Silent fail
        }
      }

      return () => clearInterval(interval)
    }, [isRunning, timeLeft, activePreset.duration, onSessionComplete, onRunningChange])

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = (initialDuration.current - timeLeft) / initialDuration.current
    const circumference = 2 * Math.PI * 140
    const strokeDashoffset = circumference * (1 - progress)

    const allPresets = [...DEFAULT_PRESETS, ...presets]

    return (
      <div className={cn(
        "glass rounded-2xl glass-hover h-full transition-all duration-500",
        focusMode ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isRunning ? "bg-primary/20" : "bg-secondary"
            )}>
              <Clock className={cn("h-4 w-4", isRunning ? "text-primary" : "text-muted-foreground")} />
            </div>
            <h2 className="text-base font-semibold text-foreground">Focus Timer</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Preset Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  "bg-secondary/80 hover:bg-secondary text-secondary-foreground"
                )}
              >
                {activePreset.name}
                <ChevronDown className={cn("h-3 w-3 transition-transform", showPresetDropdown && "rotate-180")} />
              </button>
              
              {showPresetDropdown && (
                <div className="absolute top-full right-0 mt-2 w-40 glass rounded-xl p-2 z-20 animate-fade-in-up">
                  {allPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all",
                        activePreset.id === preset.id
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-secondary/80 text-foreground"
                      )}
                    >
                      <span>{preset.name}</span>
                      <span className="text-muted-foreground">{preset.duration}m</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "rounded-lg p-1.5 transition-all",
                showSettings
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showSettings ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex flex-wrap gap-2">
              {allPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2",
                    activePreset.id === preset.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {preset.name} ({preset.duration}m)
                  {!DEFAULT_PRESETS.find((p) => p.id === preset.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePreset(preset.id)
                      }}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Preset name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-input text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                min="1"
                max="120"
                value={newPresetDuration}
                onChange={(e) => setNewPresetDuration(Number(e.target.value))}
                className="w-16 px-3 py-2 rounded-lg bg-input text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
              <button
                onClick={addPreset}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Timer Display with enhanced SVG Ring */}
            <div className={cn(
              "relative mx-auto aspect-square mb-4 transition-all duration-500",
              focusMode ? "w-48" : "w-64 md:w-72"
            )}>
              {/* Outer glow effect */}
              {isRunning && (
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-pulse" />
              )}
              
              {/* Background decorative ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 320 320">
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-secondary/30"
                  strokeDasharray="4 8"
                />
              </svg>

              <svg className="w-full h-full -rotate-90" viewBox="0 0 320 320">
                {/* Main background ring */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary/50"
                />
                
                {/* Progress ring with gradient */}
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 180)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.15 30)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(
                    "timer-ring transition-all duration-300",
                    !isRunning && "opacity-70"
                  )}
                />
                
                {/* Inner decorative circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="125"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border/50"
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  "font-mono font-bold text-foreground tabular-nums tracking-tight transition-all",
                  focusMode ? "text-4xl" : "text-5xl md:text-6xl",
                  isRunning && "text-primary"
                )}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                  {activePreset.name}
                </span>
                
                {/* Mini progress bar */}
                <div className="mt-3 w-20 h-1 rounded-full bg-secondary/50 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              {/* Tick marks around the circle */}
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{
                    height: "50%",
                    transform: `translateX(-50%) rotate(${i * 6}deg)`,
                  }}
                >
                  <div className={cn(
                    "w-px mx-auto rounded-full transition-colors",
                    i % 5 === 0 ? "h-2 bg-muted-foreground/40" : "h-1 bg-muted-foreground/20"
                  )} />
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={resetTimer}
                className="group rounded-full p-3 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
              >
                <RotateCcw className="h-5 w-5 group-hover:rotate-[-360deg] transition-transform duration-500" />
              </button>
              
              <button
                onClick={toggleTimer}
                className={cn(
                  "relative rounded-full p-5 transition-all duration-300",
                  "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                  "hover:scale-105 active:scale-95",
                  "shadow-lg shadow-primary/25",
                  isRunning && "animate-pulse-glow"
                )}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
                <div className="relative">
                  {isRunning ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-0.5" />
                  )}
                </div>
              </button>
              
              <div className="w-11" /> {/* Spacer for symmetry */}
            </div>

            {/* Session Counter */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      i < sessionsCompleted % 4
                        ? "bg-primary scale-100"
                        : "bg-secondary scale-75"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground tabular-nums">{sessionsCompleted}</span>
                {" "}sessions today
              </span>
            </div>
          </>
        )}
      </div>
    )
  }
)

PomodoroTimer.displayName = "PomodoroTimer"
