"use client"

import { useState, useEffect, useCallback } from "react"
import { Quote, RefreshCw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuoteData {
  content: string
  author: string
}

const FALLBACK_QUOTES: QuoteData[] = [
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { content: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { content: "Concentrate all your thoughts upon the work in hand.", author: "Alexander Graham Bell" },
  { content: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { content: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { content: "Your limitation—it's only your imagination.", author: "Unknown" },
]

export function QuoteDisplay() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  const fetchQuote = useCallback(async () => {
    setIsLoading(true)
    setIsChanging(true)
    
    try {
      const response = await fetch("https://api.quotable.io/random?tags=inspirational,motivational,success,wisdom&maxLength=150")
      if (response.ok) {
        const data = await response.json()
        setTimeout(() => {
          setQuote({ content: data.content, author: data.author })
          setIsChanging(false)
        }, 300)
      } else {
        throw new Error("API failed")
      }
    } catch {
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setTimeout(() => {
        setQuote(randomQuote)
        setIsChanging(false)
      }, 300)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuote()
    const interval = setInterval(fetchQuote, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchQuote])

  return (
    <div className="relative overflow-hidden glass rounded-2xl p-5 md:p-6 glass-hover group">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
      {/* Sparkle decoration */}
      <Sparkles className="absolute top-4 right-4 h-4 w-4 text-accent/30 group-hover:text-accent/50 transition-colors" />
      
      <div className="flex items-start gap-4">
        {/* Quote icon with glow */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full" />
          <div className="relative p-2 rounded-xl bg-accent/10">
            <Quote className="h-5 w-5 text-accent" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-foreground text-base md:text-lg leading-relaxed font-medium transition-all duration-300 text-balance",
              isChanging ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            &ldquo;{quote?.content || "Loading inspiration..."}&rdquo;
          </p>
          <div className={cn(
            "flex items-center gap-2 mt-3 transition-all duration-300",
            isChanging ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent max-w-16" />
            <p className="text-muted-foreground text-sm italic">
              {quote?.author || "..."}
            </p>
          </div>
        </div>
        
        {/* Refresh button */}
        <button
          onClick={fetchQuote}
          disabled={isLoading}
          className={cn(
            "flex-shrink-0 p-2.5 rounded-xl transition-all duration-300",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-secondary/80 active:scale-95",
            isLoading && "animate-spin text-primary"
          )}
          title="Get new quote"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
