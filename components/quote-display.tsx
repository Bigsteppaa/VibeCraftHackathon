"use client"

import { useState, useEffect, useCallback } from "react"
import { Quote, RefreshCw } from "lucide-react"
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
      // Use fallback quotes
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
    
    // Refresh quote every 5 minutes
    const interval = setInterval(fetchQuote, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchQuote])

  return (
    <div className="glass rounded-2xl p-4 md:p-6 glass-hover">
      <div className="flex items-start gap-3">
        <Quote className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-foreground text-sm md:text-base leading-relaxed transition-opacity duration-300",
              isChanging ? "opacity-0" : "opacity-100"
            )}
          >
            {quote?.content || "Loading inspiration..."}
          </p>
          <p
            className={cn(
              "text-muted-foreground text-xs md:text-sm mt-2 transition-opacity duration-300",
              isChanging ? "opacity-0" : "opacity-100"
            )}
          >
            — {quote?.author || "..."}
          </p>
        </div>
        <button
          onClick={fetchQuote}
          disabled={isLoading}
          className={cn(
            "flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all",
            isLoading && "animate-spin"
          )}
          title="Get new quote"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
