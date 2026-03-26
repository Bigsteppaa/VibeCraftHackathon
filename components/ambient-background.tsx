"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/app/page"

interface AmbientBackgroundProps {
  theme: Theme
}

// Seeded random for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Rain drops with parallax effect
function RainEffect() {
  const drops = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: seededRandom(i * 1.1) * 100,
    delay: seededRandom(i * 2.2) * 3,
    duration: 0.4 + seededRandom(i * 3.3) * 0.4,
    opacity: 0.1 + seededRandom(i * 4.4) * 0.3,
    size: seededRandom(i * 5.5) > 0.7 ? 2 : 1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.slice(0, 40).map((drop) => (
        <div
          key={drop.id}
          className="absolute bg-gradient-to-b from-transparent via-blue-200/30 to-blue-300/50 rounded-full rain-drop"
          style={{
            left: `${drop.left}%`,
            top: "-5%",
            width: `${drop.size}px`,
            height: `${20 + drop.size * 10}px`,
            opacity: drop.opacity,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
      {drops.slice(40).map((drop) => (
        <div
          key={drop.id + 100}
          className="absolute bg-gradient-to-b from-transparent to-blue-200/20 rounded-full rain-drop"
          style={{
            left: `${drop.left}%`,
            top: "-5%",
            width: "1px",
            height: "15px",
            opacity: drop.opacity * 0.5,
            animationDuration: `${drop.duration * 1.5}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-white/0 animate-lightning pointer-events-none" />
    </div>
  )
}

// Enhanced city with animated elements
function CityLights() {
  const windows = Array.from({ length: 60 }, (_, i) => {
    const isWarm = seededRandom(i * 6.6) > 0.3
    const hue = isWarm ? 50 + seededRandom(i * 7.7) * 20 : 180
    const alpha = isWarm ? 0.5 + seededRandom(i * 8.8) * 0.4 : 0.4 + seededRandom(i * 8.8) * 0.4
    return {
      id: i,
      left: 3 + seededRandom(i * 1.1) * 94,
      bottom: 2 + seededRandom(i * 2.2) * 25,
      color: isWarm 
        ? `oklch(0.85 0.12 ${hue} / ${alpha})`
        : `oklch(0.75 0.18 ${hue} / ${alpha})`,
      pulse: seededRandom(i * 3.3) > 0.6,
      size: 1 + seededRandom(i * 4.4),
      animDuration: 2 + seededRandom(i * 5.5) * 3,
    }
  })

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: seededRandom(i * 10.1) * 100,
    top: seededRandom(i * 11.2) * 60,
    size: 0.5 + seededRandom(i * 12.3) * 2,
    twinkle: seededRandom(i * 13.4) > 0.5,
    opacity: 0.3 + seededRandom(i * 14.5) * 0.5,
    animDuration: 1 + seededRandom(i * 15.6) * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={cn(
            "absolute rounded-full bg-white",
            star.twinkle && "animate-pulse"
          )}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.animDuration}s`,
          }}
        />
      ))}

      <div className="absolute top-[10%] right-[15%] w-16 h-16 md:w-20 md:h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 opacity-90" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-gray-400/30" />
        <div className="absolute inset-2 rounded-full" style={{
          background: "radial-gradient(circle at 30% 30%, transparent 0%, rgba(0,0,0,0.1) 100%)"
        }} />
        <div className="absolute -inset-4 rounded-full bg-white/10 blur-xl" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[30%] md:h-[35%]">
        <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="building-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.18 0.02 260)" />
              <stop offset="100%" stopColor="oklch(0.12 0.01 260)" />
            </linearGradient>
            <linearGradient id="building-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.16 0.015 260)" />
              <stop offset="100%" stopColor="oklch(0.1 0.01 260)" />
            </linearGradient>
          </defs>
          <rect x="0" y="80" width="80" height="120" fill="url(#building-grad-2)" />
          <rect x="90" y="50" width="60" height="150" fill="url(#building-grad-2)" />
          <rect x="160" y="70" width="90" height="130" fill="url(#building-grad-2)" />
          <rect x="260" y="30" width="50" height="170" fill="url(#building-grad-2)" />
          <rect x="320" y="60" width="100" height="140" fill="url(#building-grad-2)" />
          <rect x="430" y="20" width="70" height="180" fill="url(#building-grad-2)" />
          <rect x="510" y="45" width="80" height="155" fill="url(#building-grad-2)" />
          <rect x="600" y="15" width="90" height="185" fill="url(#building-grad-2)" />
          <rect x="700" y="55" width="70" height="145" fill="url(#building-grad-2)" />
          <rect x="780" y="35" width="80" height="165" fill="url(#building-grad-2)" />
          <rect x="870" y="65" width="60" height="135" fill="url(#building-grad-2)" />
          <rect x="940" y="25" width="90" height="175" fill="url(#building-grad-2)" />
          <rect x="1040" y="50" width="70" height="150" fill="url(#building-grad-2)" />
          <rect x="1120" y="75" width="80" height="125" fill="url(#building-grad-2)" />
          <rect x="40" y="100" width="70" height="100" fill="url(#building-grad-1)" />
          <rect x="120" y="60" width="55" height="140" fill="url(#building-grad-1)" />
          <rect x="185" y="85" width="85" height="115" fill="url(#building-grad-1)" />
          <rect x="280" y="40" width="60" height="160" fill="url(#building-grad-1)" />
          <rect x="350" y="70" width="75" height="130" fill="url(#building-grad-1)" />
          <rect x="435" y="35" width="65" height="165" fill="url(#building-grad-1)" />
          <rect x="510" y="55" width="90" height="145" fill="url(#building-grad-1)" />
          <rect x="610" y="25" width="70" height="175" fill="url(#building-grad-1)" />
          <rect x="690" y="65" width="80" height="135" fill="url(#building-grad-1)" />
          <rect x="780" y="45" width="65" height="155" fill="url(#building-grad-1)" />
          <rect x="855" y="75" width="75" height="125" fill="url(#building-grad-1)" />
          <rect x="940" y="35" width="85" height="165" fill="url(#building-grad-1)" />
          <rect x="1035" y="60" width="70" height="140" fill="url(#building-grad-1)" />
          <rect x="1115" y="90" width="85" height="110" fill="url(#building-grad-1)" />
        </svg>
      </div>
      
      {windows.map((w) => (
        <div
          key={w.id}
          className={cn(
            "absolute rounded-sm",
            w.pulse && "animate-pulse"
          )}
          style={{
            left: `${w.left}%`,
            bottom: `${w.bottom}%`,
            width: `${w.size * 2}px`,
            height: `${w.size * 3}px`,
            backgroundColor: w.color,
            boxShadow: `0 0 ${4 + w.size * 2}px ${w.color}`,
            animationDuration: `${w.animDuration}s`,
          }}
        />
      ))}
    </div>
  )
}

// Aurora borealis effect
function AuroraEffect() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: seededRandom(i * 20.1) * 100,
    top: seededRandom(i * 21.2) * 70,
    size: 0.5 + seededRandom(i * 22.3) * 2,
    opacity: 0.3 + seededRandom(i * 23.4) * 0.5,
    animDuration: 1 + seededRandom(i * 24.5) * 3,
    animDelay: seededRandom(i * 25.6) * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 right-0 h-1/2 opacity-30 animate-aurora"
          style={{
            background: "linear-gradient(180deg, transparent 0%, oklch(0.7 0.2 150 / 0.3) 30%, oklch(0.6 0.18 180 / 0.2) 50%, oklch(0.5 0.15 280 / 0.1) 70%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />
        <div 
          className="absolute top-0 left-1/4 right-1/4 h-2/5 opacity-20 animate-aurora"
          style={{
            background: "linear-gradient(180deg, transparent 0%, oklch(0.6 0.2 120 / 0.4) 40%, oklch(0.5 0.15 200 / 0.2) 70%, transparent 100%)",
            filter: "blur(60px)",
            animationDelay: "1s",
          }}
        />
      </div>
      
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.animDuration}s`,
            animationDelay: `${star.animDelay}s`,
          }}
        />
      ))}
      
      <div className="absolute bottom-0 left-0 right-0 h-[25%]">
        <svg className="w-full h-full" viewBox="0 0 1200 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.25 0.03 260)" />
              <stop offset="100%" stopColor="oklch(0.12 0.01 260)" />
            </linearGradient>
          </defs>
          <path 
            d="M0,150 L0,100 L100,70 L200,90 L300,40 L400,80 L500,30 L600,60 L700,20 L800,50 L900,35 L1000,65 L1100,45 L1200,75 L1200,150 Z"
            fill="url(#mountain-grad)"
          />
        </svg>
      </div>
    </div>
  )
}

// Sunset effect
function SunsetEffect() {
  const shimmers = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: 30 + seededRandom(i * 30.1) * 40,
    top: 10 + i * 5,
    width: 10 + seededRandom(i * 31.2) * 30,
    animDelay: seededRandom(i * 32.3) * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-yellow-300 to-orange-500" />
          <div className="absolute -inset-4 rounded-full bg-orange-400/20 blur-2xl animate-pulse" />
          <div className="absolute -inset-8 rounded-full bg-orange-300/10 blur-3xl" />
        </div>
      </div>
      
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${10 + i * 20}%`,
            top: `${15 + (i % 3) * 10}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        >
          <div className="flex gap-1">
            <div className="w-12 h-4 md:w-16 md:h-6 rounded-full bg-white/10 blur-sm" />
            <div className="w-8 h-3 md:w-10 md:h-4 rounded-full bg-white/10 blur-sm -ml-4 mt-1" />
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-0 left-0 right-0 h-[30%]">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/80 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full">
          <div className="w-full h-full bg-gradient-to-b from-orange-400/30 via-orange-300/10 to-transparent blur-md" />
        </div>
        {shimmers.map((shimmer) => (
          <div
            key={shimmer.id}
            className="absolute h-px bg-orange-200/20 animate-shimmer"
            style={{
              left: `${shimmer.left}%`,
              top: `${shimmer.top}%`,
              width: `${shimmer.width}px`,
              animationDelay: `${shimmer.animDelay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function AmbientBackground({ theme }: AmbientBackgroundProps) {
  const [ambientVolume, setAmbientVolume] = useState(30)
  const [isAmbientMuted, setIsAmbientMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const ambientSounds: Record<Theme, string> = {
    rain: "https://cdn.pixabay.com/download/audio/2022/05/13/audio_257112ce99.mp3?filename=rain-and-thunder-16705.mp3",
    "night-city": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1fc2.mp3?filename=city-ambience-9272.mp3",
    aurora: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_942e70789d.mp3?filename=wind-artic-cold-6195.mp3",
    sunset: "https://cdn.pixabay.com/download/audio/2022/01/20/audio_7cf8cd7617.mp3?filename=ocean-waves-112906.mp3",
  }

  const themeGradients: Record<Theme, string> = {
    rain: "from-slate-900 via-slate-800 to-slate-900",
    "night-city": "from-indigo-950 via-slate-900 to-slate-950",
    aurora: "from-slate-950 via-indigo-950 to-slate-900",
    sunset: "from-orange-900/80 via-rose-900/60 to-slate-900",
  }

  const themeOrbs: Record<Theme, { color: string; color2: string }> = {
    rain: { color: "bg-blue-500", color2: "bg-cyan-400" },
    "night-city": { color: "bg-primary", color2: "bg-accent" },
    aurora: { color: "bg-emerald-400", color2: "bg-cyan-400" },
    sunset: { color: "bg-orange-400", color2: "bg-rose-400" },
  }

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
    }

    const audio = audioRef.current
    audio.src = ambientSounds[theme]
    audio.volume = isAmbientMuted ? 0 : ambientVolume / 100

    if (!isAmbientMuted) {
      audio.play().catch(() => {})
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

  const orbs = themeOrbs[theme]

  return (
    <>
      <div className={cn(
        "absolute inset-0 transition-all duration-1000 bg-gradient-to-b",
        themeGradients[theme]
      )} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-float opacity-20",
            orbs.color
          )}
          style={{ animationDelay: "0s", animationDuration: "6s" }}
        />
        <div
          className={cn(
            "absolute top-1/3 -right-20 w-80 h-80 rounded-full blur-3xl animate-float opacity-15",
            orbs.color2
          )}
          style={{ animationDelay: "2s", animationDuration: "7s" }}
        />
        <div
          className={cn(
            "absolute -bottom-20 left-1/4 w-72 h-72 rounded-full blur-3xl animate-float opacity-10",
            orbs.color
          )}
          style={{ animationDelay: "4s", animationDuration: "8s" }}
        />
      </div>

      {theme === "rain" && <RainEffect />}
      {theme === "night-city" && <CityLights />}
      {theme === "aurora" && <AuroraEffect />}
      {theme === "sunset" && <SunsetEffect />}

      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass rounded-xl p-2.5 flex items-center gap-2">
          <button
            onClick={toggleAmbient}
            className={cn(
              "p-2 rounded-lg transition-all",
              isAmbientMuted
                ? "text-muted-foreground hover:text-foreground hover:bg-secondary"
                : "bg-primary/20 text-primary"
            )}
            title={isAmbientMuted ? "Play ambient sounds" : "Mute ambient sounds"}
          >
            {isAmbientMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          {!isAmbientMuted && (
            <div className="relative w-20 group">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${ambientVolume}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, oklch(0.12 0.01 260 / 0.4) 100%)"
        }}
      />
    </>
  )
}
