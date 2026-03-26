"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react"
import { Play, Pause, RotateCcw, Clock, Settings, Plus, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerPreset {
  id: string
  name: string
  duration: number
}

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: "1", name: "Pomodoro", duration: 25 },
  { id: "2", name: "Short Break", duration: 5 },
  { id: "3", name: "Long Break", duration: 15 },
]

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number) => void
  onRunningChange?: (running: boolean) => void
}

export interface PomodoroTimerRef {
  toggleTimer: () => void
  isRunning: boolean
}

export const PomodoroTimer = forwardRef<PomodoroTimerRef, PomodoroTimerProps>(
  ({ onSessionComplete, onRunningChange }, ref) => {
    const [presets, setPresets] = useState<TimerPreset[]>([])
    const [activePreset, setActivePreset] = useState<TimerPreset>(DEFAULT_PRESETS[0])
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [sessionsCompleted, setSessionsCompleted] = useState(0)
    const [showSettings, setShowSettings] = useState(false)
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

    // Save presets to localStorage
    useEffect(() => {
      localStorage.setItem("timer-presets", JSON.stringify(presets))
    }, [presets])

    // Save sessions count
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
      onRunningChange?.(false)
    }

    const addPreset = () => {
      if (newPresetName.trim() && newPresetDuration > 0) {
        const newPreset: TimerPreset = {
          id: crypto.randomUUID(),
          name: newPresetName.trim(),
          duration: newPresetDuration,
        }
        setPresets((prev) => [...prev, newPreset])
        setNewPresetName("")
        setNewPresetDuration(25)
      }
    }

    const deletePreset = (id: string) => {
      setPresets((prev) => prev.filter((p) => p.id !== id))
    }

    // Timer logic
    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => prev - 1)
        }, 1000)
      } else if (timeLeft === 0 && isRunning) {
        // Timer completed
        setIsRunning(false)
        onRunningChange?.(false)
        setSessionsCompleted((prev) => prev + 1)
        onSessionComplete?.(activePreset.duration)
        
        // Play completion sound
        try {
          audioRef.current = new Audio("/timer-complete.mp3")
          audioRef.current.play().catch(() => {
            // Fallback: use Web Audio API for a simple beep
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
          // Silent fail if audio is not supported
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
    const circumference = 2 * Math.PI * 120
    const strokeDashoffset = circumference * (1 - progress)

    return (
      <div className="glass rounded-2xl p-6 glass-hover h-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Focus Timer</h2>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "rounded-full p-2 transition-all",
              showSettings
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {showSettings ? (
          <div className="space-y-4">
            {/* Preset selector */}
            <div className="flex flex-wrap gap-2">
              {[...DEFAULT_PRESETS, ...presets].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2",
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

            {/* Add new preset */}
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
            {/* Timer Display with SVG Ring */}
            <div className="relative mx-auto w-64 h-64 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
                {/* Background ring */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                {/* Progress ring */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(
                    "timer-ring",
                    isRunning ? "text-primary" : "text-primary/50"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-mono font-bold text-foreground tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-2">
                  {activePreset.name}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={resetTimer}
                className="rounded-full p-3 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={toggleTimer}
                className={cn(
                  "rounded-full p-4 transition-all duration-300",
                  "bg-primary text-primary-foreground",
                  "hover:scale-105 active:scale-95",
                  isRunning && "animate-pulse-glow"
                )}
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </button>
            </div>

            {/* Session Counter */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary" />
              <span>
                <span className="font-semibold text-foreground">{sessionsCompleted}</span> sessions
                completed today
              </span>
            </div>
          </>
        )}
      </div>
    )
  }
)

PomodoroTimer.displayName = "PomodoroTimer"
