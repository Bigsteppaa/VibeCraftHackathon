"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/app/page"

interface AmbientBackgroundProps {
  theme: Theme
}

// Rain drops component
function RainEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300/20 to-blue-400/30 rounded-full rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

// City lights component
function CityLights() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Building silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64">
        <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="building-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.2 0.02 260)" />
              <stop offset="100%" stopColor="oklch(0.12 0.01 260)" />
            </linearGradient>
          </defs>
          {/* Buildings */}
          <rect x="0" y="120" width="60" height="80" fill="url(#building-gradient)" />
          <rect x="70" y="80" width="50" height="120" fill="url(#building-gradient)" />
          <rect x="130" y="100" width="70" height="100" fill="url(#building-gradient)" />
          <rect x="210" y="60" width="40" height="140" fill="url(#building-gradient)" />
          <rect x="260" y="90" width="80" height="110" fill="url(#building-gradient)" />
          <rect x="350" y="40" width="50" height="160" fill="url(#building-gradient)" />
          <rect x="410" y="70" width="60" height="130" fill="url(#building-gradient)" />
          <rect x="480" y="50" width="45" height="150" fill="url(#building-gradient)" />
          <rect x="535" y="85" width="55" height="115" fill="url(#building-gradient)" />
          <rect x="600" y="30" width="70" height="170" fill="url(#building-gradient)" />
          <rect x="680" y="75" width="50" height="125" fill="url(#building-gradient)" />
          <rect x="740" y="95" width="65" height="105" fill="url(#building-gradient)" />
          <rect x="815" y="55" width="55" height="145" fill="url(#building-gradient)" />
          <rect x="880" y="80" width="60" height="120" fill="url(#building-gradient)" />
          <rect x="950" y="45" width="50" height="155" fill="url(#building-gradient)" />
          <rect x="1010" y="90" width="70" height="110" fill="url(#building-gradient)" />
          <rect x="1090" y="70" width="55" height="130" fill="url(#building-gradient)" />
          <rect x="1155" y="100" width="45" height="100" fill="url(#building-gradient)" />
        </svg>
      </div>
      
      {/* Glowing windows */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-sm"
          style={{
            left: `${5 + Math.random() * 90}%`,
            bottom: `${5 + Math.random() * 20}%`,
            backgroundColor: Math.random() > 0.5 
              ? "oklch(0.85 0.12 60 / 0.8)" 
              : "oklch(0.75 0.18 180 / 0.6)",
            boxShadow: `0 0 ${4 + Math.random() * 6}px oklch(0.85 0.12 60 / 0.5)`,
            animation: Math.random() > 0.7 ? `pulse ${2 + Math.random() * 3}s ease-in-out infinite` : "none",
          }}
        />
      ))}

      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            animation: `pulse ${1 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export function AmbientBackground({ theme }: AmbientBackgroundProps) {
  const [ambientVolume, setAmbientVolume] = useState(30)
  const [isAmbientMuted, setIsAmbientMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Ambient sounds URLs
  const ambientSounds = {
    rain: "https://cdn.pixabay.com/download/audio/2022/05/13/audio_257112ce99.mp3?filename=rain-and-thunder-16705.mp3",
    "night-city": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1fc2.mp3?filename=city-ambience-9272.mp3",
  }

  useEffect(() => {
    // Create or update audio element
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
    }

    const audio = audioRef.current
    audio.src = ambientSounds[theme]
    audio.volume = isAmbientMuted ? 0 : ambientVolume / 100

    if (!isAmbientMuted) {
      audio.play().catch(() => {
        // Autoplay blocked, wait for user interaction
      })
    }

    return () => {
      audio.pause()
    }
  }, [theme, isAmbientMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isAmbientMuted ? 0 : ambientVolume / 100
    }
  }, [ambientVolume, isAmbientMuted])

  const toggleAmbient = () => {
    setIsAmbientMuted((prev) => {
      const newState = !prev
      if (!newState && audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
      return newState
    })
  }

  return (
    <>
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-1000",
          theme === "rain"
            ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950"
        )}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-float opacity-20",
            theme === "rain"
              ? "bg-blue-500"
              : "bg-primary"
          )}
          style={{ animationDelay: "0s" }}
        />
        <div
          className={cn(
            "absolute top-1/2 -right-20 w-60 h-60 rounded-full blur-3xl animate-float opacity-15",
            theme === "rain"
              ? "bg-cyan-400"
              : "bg-accent"
          )}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={cn(
            "absolute -bottom-20 left-1/3 w-72 h-72 rounded-full blur-3xl animate-float opacity-10",
            theme === "rain"
              ? "bg-slate-500"
              : "bg-indigo-500"
          )}
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Theme-specific effects */}
      {theme === "rain" ? <RainEffect /> : <CityLights />}

      {/* Ambient sound control */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <button
            onClick={toggleAmbient}
            className={cn(
              "p-2 rounded-lg transition-all",
              isAmbientMuted
                ? "text-muted-foreground hover:text-foreground hover:bg-secondary"
                : "bg-primary text-primary-foreground"
            )}
            title={isAmbientMuted ? "Unmute ambient" : "Mute ambient"}
          >
            {isAmbientMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          {!isAmbientMuted && (
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(Number(e.target.value))}
              className="w-20 h-1 bg-secondary rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  )
}
