"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio, Music2, Disc3 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/app/page"

interface Track {
  id: string
  name: string
  artist: string
  streamUrl: string
  color: string
}

const LOFI_STREAMS: Track[] = [
  {
    id: "1",
    name: "Lofi Hip Hop",
    artist: "ChilledCow",
    streamUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&enablejsapi=1",
    color: "from-primary/30 to-accent/20",
  },
  {
    id: "2",
    name: "Synthwave",
    artist: "ChillSynth",
    streamUrl: "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&enablejsapi=1",
    color: "from-chart-3/30 to-chart-5/20",
  },
  {
    id: "3",
    name: "Jazz Vibes",
    artist: "The Bootleg Boy",
    streamUrl: "https://www.youtube.com/embed/kgx4WGK0oNU?autoplay=1&enablejsapi=1",
    color: "from-chart-4/30 to-accent/20",
  },
  {
    id: "4",
    name: "Ambient Focus",
    artist: "Sleepy Fish",
    streamUrl: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&enablejsapi=1",
    color: "from-chart-3/30 to-primary/20",
  },
]

interface MusicPlayerProps {
  theme: Theme
  onPlayingChange?: (playing: boolean) => void
  compact?: boolean
}

export interface MusicPlayerRef {
  toggle: () => void
  isPlaying: boolean
}

export const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(
  ({ onPlayingChange, compact = false }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(0)
    const [volume, setVolume] = useState(70)
    const [isMuted, setIsMuted] = useState(false)
    const [showPlayer, setShowPlayer] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useImperativeHandle(ref, () => ({
      toggle: () => togglePlay(),
      isPlaying,
    }))

    const togglePlay = () => {
      const newState = !isPlaying
      setIsPlaying(newState)
      setShowPlayer(newState)
      onPlayingChange?.(newState)
    }

    const nextTrack = () => {
      setCurrentTrack((prev) => (prev + 1) % LOFI_STREAMS.length)
      if (isPlaying) {
        setShowPlayer(true)
      }
    }

    const prevTrack = () => {
      setCurrentTrack((prev) => (prev - 1 + LOFI_STREAMS.length) % LOFI_STREAMS.length)
      if (isPlaying) {
        setShowPlayer(true)
      }
    }

    const toggleMute = () => {
      setIsMuted((prev) => !prev)
    }

    const currentColor = LOFI_STREAMS[currentTrack].color

    return (
      <div className={cn(
        "glass rounded-2xl glass-hover h-full overflow-hidden transition-all duration-500",
        compact ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isPlaying ? "bg-primary/20" : "bg-secondary"
            )}>
              <Radio className={cn("h-4 w-4", isPlaying ? "text-primary" : "text-muted-foreground")} />
            </div>
            <h2 className="text-base font-semibold text-foreground">Lofi Radio</h2>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1 h-4 px-2 py-1 rounded-full bg-primary/10">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="eq-bar w-0.5 bg-primary rounded-full"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Album Art / Visualizer */}
        <div className={cn(
          "relative mx-auto rounded-2xl overflow-hidden mb-4 transition-all duration-500",
          compact ? "h-28" : "h-36 md:h-40"
        )}>
          {/* Background gradient based on track */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-all duration-700",
            currentColor
          )} />
          
          {/* Animated vinyl/disc */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "relative transition-all duration-500",
              compact ? "w-20 h-20" : "w-24 h-24 md:w-28 md:h-28"
            )}>
              {/* Disc shadow */}
              <div className="absolute inset-0 bg-black/20 rounded-full blur-xl translate-y-2" />
              
              {/* Vinyl disc */}
              <div className={cn(
                "relative w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl",
                isPlaying && "animate-spin"
              )} style={{ animationDuration: "3s" }}>
                {/* Vinyl grooves */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-gray-700/30"
                    style={{
                      inset: `${(i + 1) * 10}%`,
                    }}
                  />
                ))}
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/3 h-1/3 rounded-full bg-gradient-to-br from-primary/80 to-accent/60 flex items-center justify-center">
                    <Music2 className="h-3 w-3 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden YouTube player */}
          {showPlayer && isPlaying && (
            <iframe
              ref={iframeRef}
              src={LOFI_STREAMS[currentTrack].streamUrl}
              className="absolute opacity-0 pointer-events-none"
              allow="autoplay; encrypted-media"
              width="1"
              height="1"
            />
          )}

          {/* Floating music notes decoration */}
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float text-white/20"
                  style={{
                    left: `${20 + i * 30}%`,
                    bottom: "20%",
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: "2s",
                  }}
                >
                  <Music2 className="h-4 w-4" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-4">
          <h3 className="text-foreground font-semibold text-lg truncate flex items-center justify-center gap-2">
            {LOFI_STREAMS[currentTrack].name}
            {isPlaying && <Disc3 className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "2s" }} />}
          </h3>
          <p className="text-sm text-muted-foreground">
            {LOFI_STREAMS[currentTrack].artist}
          </p>
        </div>

        {/* Track Selector Dots */}
        <div className="flex gap-2 justify-center mb-4">
          {LOFI_STREAMS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrack(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentTrack === index
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 w-1.5 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={prevTrack}
            className="group rounded-full p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          >
            <SkipBack className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button
            onClick={togglePlay}
            className={cn(
              "relative rounded-full p-4 transition-all duration-300",
              "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
              "hover:scale-105 active:scale-95",
              "shadow-lg shadow-primary/25",
              isPlaying && "animate-pulse-glow"
            )}
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
            <div className="relative">
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </div>
          </button>
          
          <button
            onClick={nextTrack}
            className="group rounded-full p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          >
            <SkipForward className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 px-2">
          <button
            onClick={toggleMute}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              isMuted ? "text-destructive" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex-1 relative group">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-150"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value))
                setIsMuted(false)
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
            {/* Hover thumb indicator */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${isMuted ? 0 : volume}% - 6px)` }}
            />
          </div>
          
          <span className="text-xs text-muted-foreground w-8 text-right font-mono tabular-nums">
            {isMuted ? 0 : volume}%
          </span>
        </div>
      </div>
    )
  }
)

MusicPlayer.displayName = "MusicPlayer"
