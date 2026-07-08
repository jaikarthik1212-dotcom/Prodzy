"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, FileText, ArrowRight } from "lucide-react"
import { searchContent } from "@/app/actions/content"
import { getStatusConfig, getPlatformConfig } from "@/lib/constants"

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    const res = await searchContent(q)
    setResults(res.data || [])
    setIsSearching(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query, handleSearch])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-4 px-1.5 py-0.5 rounded bg-white/5 text-xs font-mono">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search content, projects, platforms..."
              className="flex-1 bg-transparent text-white placeholder:text-muted-foreground/50 focus:outline-none text-sm"
            />
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {isSearching && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {!isSearching && query.length >= 2 && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            )}
            {!isSearching && query.length < 2 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
            {results.map((item) => {
              const status = getStatusConfig(item.status)
              return (
                <button
                  key={item.id}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left hover:bg-white/5 transition-colors group"
                >
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.project?.name} · {item.platform} · {item.contentType}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                    {item.status}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
