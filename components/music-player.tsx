"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/app/page"

interface Track {
  id: string
  name: string
  artist: string
  streamUrl: string
}

const LOFI_STREAMS: Track[] = [
  {
    id: "1",
    name: "Lofi Hip Hop Radio",
    artist: "ChilledCow",
    streamUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&enablejsapi=1",
  },
  {
    id: "2",
    name: "Synthwave Radio",
    artist: "ChillSynth",
    streamUrl: "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&enablejsapi=1",
  },
  {
    id: "3",
    name: "Jazz Lofi Beats",
    artist: "The Bootleg Boy",
    streamUrl: "https://www.youtube.com/embed/kgx4WGK0oNU?autoplay=1&enablejsapi=1",
  },
]

interface MusicPlayerProps {
  theme: Theme
  onPlayingChange?: (playing: boolean) => void
}

export interface MusicPlayerRef {
  toggle: () => void
  isPlaying: boolean
}

export const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(
  ({ theme, onPlayingChange }, ref) => {
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

    return (
      <div className="glass rounded-2xl p-6 glass-hover h-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Lofi Radio</h2>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1 h-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="eq-bar w-1 bg-primary rounded-full"
                  style={{
                    height: "100%",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="mb-6 text-center">
          <div className="mb-4 mx-auto h-32 w-32 rounded-xl overflow-hidden bg-secondary/50 flex items-center justify-center relative">
            {showPlayer && isPlaying ? (
              <iframe
                ref={iframeRef}
                src={LOFI_STREAMS[currentTrack].streamUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                style={{ opacity: 0, position: "absolute" }}
              />
            ) : null}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-accent/20",
              isPlaying && "animate-pulse-glow"
            )}>
              <Radio className="h-12 w-12 text-primary/60" />
            </div>
          </div>
          <h3 className="text-foreground font-medium truncate">
            {LOFI_STREAMS[currentTrack].name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {LOFI_STREAMS[currentTrack].artist}
          </p>
        </div>

        {/* Track Selector */}
        <div className="mb-4 flex gap-2 justify-center">
          {LOFI_STREAMS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrack(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                currentTrack === index
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={prevTrack}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            className={cn(
              "rounded-full p-4 transition-all duration-300",
              "bg-primary text-primary-foreground",
              "hover:scale-105 active:scale-95",
              isPlaying && "animate-pulse-glow"
            )}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value))
              setIsMuted(false)
            }}
            className="flex-1 h-1 bg-secondary rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-125"
          />
          <span className="text-xs text-muted-foreground w-8 text-right font-mono">
            {isMuted ? 0 : volume}%
          </span>
        </div>
      </div>
    )
  }
)

MusicPlayer.displayName = "MusicPlayer"
